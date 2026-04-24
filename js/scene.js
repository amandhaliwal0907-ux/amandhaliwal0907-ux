import * as THREE from 'three';

const canvas = document.getElementById('threeCanvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});

renderer.setSize(innerWidth, innerHeight);

const cube = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 1.2, 1.2)),
  new THREE.LineBasicMaterial({ color: 0x33ccff })
);

scene.add(cube);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.006;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();