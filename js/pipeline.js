(function () {
  'use strict';

  const PI      = Math.PI;
  const TAU     = 2 * PI;
  const HALF_PI = 0.5 * PI;
  const TO_RAD  = PI / 180;
  const rand    = n => Math.random() * n;
  const round   = n => Math.round(n);
  const cos     = n => Math.cos(n);
  const sin     = n => Math.sin(n);

  function fadeInOut(t, m) {
    const h = 0.5 * m;
    return Math.abs((t % m) - h) / h;
  }

  const pipeCount       = 30;
  const pipePropCount   = 8;
  const pipePropsLength = pipeCount * pipePropCount;
  const turnCount       = 8;
  const turnAmount      = (360 / turnCount) * TO_RAD;
  const turnChanceRange = 58;
  const baseSpeed       = 0.5;
  const rangeSpeed      = 1;
  const baseTTL         = 100;
  const rangeTTL        = 300;
  const baseWidth       = 2;
  const rangeWidth      = 4;
  const baseHue         = 210;
  const rangeHue        = 20;
  const backgroundColor = 'hsla(210,15%,6%,1)';

  const canvasA = document.createElement('canvas');
  const ctxA    = canvasA.getContext('2d');

  const canvasB = document.createElement('canvas');
  canvasB.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none',
  ].join(';');
  document.getElementById('pipelineContainer').appendChild(canvasB);
  const ctxB = canvasB.getContext('2d');

  let center    = [0, 0];
  let tick      = 0;
  let pipeProps;
  let raf;
  let running   = true;

  function resize() {
    const W = window.innerWidth, H = window.innerHeight;
    canvasA.width  = W; canvasA.height = H;
    canvasB.width  = W; canvasB.height = H;
    center[0] = W * 0.5;
    center[1] = H * 0.5;
  }

  function initPipes() {
    pipeProps = new Float32Array(pipePropsLength);
    for (let i = 0; i < pipePropsLength; i += pipePropCount) initPipe(i);
  }

  function initPipe(i) {
    const x         = rand(canvasA.width);
    const y         = center[1];
    const direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
    const speed     = baseSpeed + rand(rangeSpeed);
    const life      = 0;
    const ttl       = baseTTL + rand(rangeTTL);
    const width     = baseWidth + rand(rangeWidth);
    const hue       = baseHue + rand(rangeHue);
    pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
  }

  function updatePipes() {
    tick++;
    for (let i = 0; i < pipePropsLength; i += pipePropCount) updatePipe(i);
  }

  function updatePipe(i) {
    let x         = pipeProps[i];
    let y         = pipeProps[i + 1];
    let direction = pipeProps[i + 2];
    const speed   = pipeProps[i + 3];
    let life      = pipeProps[i + 4];
    const ttl     = pipeProps[i + 5];
    const width   = pipeProps[i + 6];
    const hue     = pipeProps[i + 7];

    drawPipe(x, y, life, ttl, width, hue);

    life++;
    x += cos(direction) * speed;
    y += sin(direction) * speed;

    const turnChance = !(tick % round(rand(turnChanceRange))) &&
                       (!(round(x) % 6) || !(round(y) % 6));
    const turnBias   = round(rand(1)) ? -1 : 1;
    direction       += turnChance ? turnAmount * turnBias : 0;

    pipeProps[i]     = x;
    pipeProps[i + 1] = y;
    pipeProps[i + 2] = direction;
    pipeProps[i + 4] = life;

    if (x > canvasA.width)  pipeProps[i]     = 0;
    if (x < 0)              pipeProps[i]     = canvasA.width;
    if (y > canvasA.height) pipeProps[i + 1] = 0;
    if (y < 0)              pipeProps[i + 1] = canvasA.height;

    if (life > ttl) initPipe(i);
  }

  function drawPipe(x, y, life, ttl, width, hue) {
    ctxA.save();
    ctxA.strokeStyle = `hsla(${hue},20%,80%,${fadeInOut(life, ttl) * 0.18})`;
    ctxA.beginPath();
    ctxA.arc(x, y, width, 0, TAU);
    ctxA.stroke();
    ctxA.closePath();
    ctxA.restore();
  }

  function render() {
    ctxB.save();
    ctxB.fillStyle = backgroundColor;
    ctxB.fillRect(0, 0, canvasB.width, canvasB.height);
    ctxB.restore();

    ctxB.save();
    ctxB.filter = 'blur(12px)';
    ctxB.drawImage(canvasA, 0, 0);
    ctxB.restore();

    ctxB.save();
    ctxB.drawImage(canvasA, 0, 0);
    ctxB.restore();
  }

  function draw() {
    if (!running) return;
    updatePipes();
    render();
    raf = requestAnimationFrame(draw);
  }

  window._pipeStop = function () {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    canvasB.style.display = 'none';
  };

  window._pipeStart = function () {
    canvasB.style.display = 'block';
    running = true;
    draw();
  };

  window._pipeReset = function () {
    ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
    ctxB.clearRect(0, 0, canvasB.width, canvasB.height);
    tick = 0;
    initPipes();
  };

  window.addEventListener('resize', resize);
  resize();
  initPipes();
  draw();
})();