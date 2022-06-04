import "../style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
/*
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
const fontLoader = new THREE.FontLoader();

fontLoader.load(
  "/node_modules/three/fonts/helvetiker_regular.typeface.json",
  (font) => {
    //Geometry
    const textGeometry = new THREE.TextBufferGeometry(
      "FROGGY", //Text that you want to display
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      }
    );

    textGeometry.center(); //to center the text at the axis

    //Material - make sure you use Normal material to get that gradient color
    const textMaterial = new THREE.MeshNormalMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text); //don't forget to add the text to scene
  }
);
*/

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);
camera.position.setY(3);

const gltf_loader = new GLTFLoader();

const earth_texture = new THREE.TextureLoader().load("earth_texture.jpg");
const moon_texture = new THREE.TextureLoader().load("moon_texture.jpg");

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(2, 20, 20),
  new THREE.MeshStandardMaterial({ map: earth_texture })
);
scene.add(earth);

const earth_obj = new THREE.Object3D();
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 20, 20),
  new THREE.MeshStandardMaterial({ map: moon_texture })
);
scene.add(earth_obj);
earth_obj.add(moon);
earth_obj.rotation.x = -40;
moon.position.x = 6.7;

var model;
gltf_loader.load("froggy.gltf", (gltf) => {
  model = gltf.scene;
  earth.add(model);

  model.position.y = 2;
});
if (model) model.position.x = 100;

//Code from fireships three.js tutorial

function add_star() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(add_star);

const point_light = new THREE.PointLight(0xffffff, 2, 300);
point_light.position.set(6, 2, 2);
scene.add(point_light);

const ambeint_light = new THREE.AmbientLight(0xffffff);
ambeint_light.position.set(30, 30, 30);
scene.add(ambeint_light);

//Button click
const button = document.querySelector("button");
let click = false;

button.addEventListener("click", () => {
  click = true;
  setTimeout(() => {
    console.log("World!");
    window.history.pushState("next", null, "./portfolio.html");
    location.reload();
  }, 1000);
});

//Eventlistenrers for cube rotations
let is_moving = false;

let mouse_x = 0;
let mouse_y = 0;

let target_x = 0;
let target_y = 0;

document.addEventListener("mousedown", (e) => {
  is_moving = true;
});

document.addEventListener("pointermove", (e) => {
  if (is_moving) {
    mouse_x = e.clientX - window.innerWidth / 2;
    mouse_y = e.clientY - window.innerHeight / 2;
  }
});

document.addEventListener("mouseup", (e) => {
  if (is_moving) {
    is_moving = false;
  }
});

let camera_speed = 40;

function animate() {
  requestAnimationFrame(animate);

  target_x = mouse_x;
  target_y = mouse_y;

  earth.rotation.y += 0.01;
  earth_obj.rotation.y += 0.005;

  if (is_moving) {
    earth.rotation.y += 0.0001 * target_x;
    earth.rotation.z += 0.0001 * target_y;
  }

  if (click) {
    camera_speed += 0.5;
    camera.position.setZ(camera_speed);
    console.log("weee");
  }

  renderer.render(scene, camera);
}

animate();
