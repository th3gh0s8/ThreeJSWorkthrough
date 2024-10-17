import * as THREE from "three"; //impors ThreeJS
import { OrbitControls, Wireframe } from "three/examples/jsm/Addons.js";
import * as dat from "dat.gui";

import stars from "../imgs/stars_galaxy.jpg";
import nebula from "../imgs/nebula.jpg";

const renderer = new THREE.WebGLRenderer(); //  creates a new instance of the WebGLRenderer

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight); // sets the size of the renderer to match the inner width and height of the browser window.

document.body.appendChild(renderer.domElement); // adds the renderer's DOM element to the body of the HTML document. adds the renderer's DOM element to the body of the HTML document. (This makes the renderer visible in the browser)

const scene = new THREE.Scene(); // creates a new instance of the Scene class, which represents the 3D scene.

// creates a new instance of the PerspectiveCamera class, which represents the camera in the 3D scene.
const camera = new THREE.PerspectiveCamera( // PerspectiveCamera class takes four arguments:
  45, // fov (field of view): in degrees
  window.innerWidth / window.innerHeight, // aspect: the aspect ratio of the camera, calculated as the window's inner width divided by its inner height
  0.1, // near: the near clipping plane: 0.1
  1000, // far: the far clipping plane: 1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(3);
/*
The code creates a new instance of the AxesHelper class, which represents a set of axes (x, y, z) in the 3D scene.
The AxesHelper class takes one argument: the size of the axes (3 in this case).
The code adds the axes helper to the scene
*/
scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 2;

/*
    The code sets the position of the camera in the 3D scene.
    The set method takes three arguments: x, y, and z coordinates.
 */
camera.position.set(-10, 30, 36);

orbit.update();

/**
 *The code creates a new instance of the BoxGeometry class, which represents a 3D box.
The BoxGeometry class is a part of the Three.js library
 */

const boxGeometry = new THREE.BoxGeometry();

/**
    The code creates a new instance of the MeshBasicMaterial class, which represents a basic material for a 3D mesh.
    The MeshBasicMaterial class takes an options object with a color property, which is set to green (0x00FF00).
 */
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

/**
    The code creates a new instance of the Mesh class, which represents a 3D mesh.
    The Mesh class takes two arguments: the geometry (boxGeometry) and the material (boxMaterial).
    The code adds the box mesh to the scene.
 */
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
);
scene.add(directionalLightHelper);

const directionalLightShadowHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera,
);
scene.add(directionalLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0xffea00);

const textureLoder = new THREE.TextureLoader();
// this is 2D
scene.background = textureLoder.load(stars);

// THis id 3D
// const cubeTextureLoder = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoder.load([
//   stars,
//   stars,
//   stars,
//   stars,
//   stars,
//   stars
// ]);

const gui = new dat.GUI();

const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

/**
    The code defines an animate function, which is called repeatedly to animate the scene.
    The animate function updates the rotation of the box mesh and renders the scene using the render method of the renderer.
    The setAnimationLoop method is used to set the animate function as the animation loop
 */

// function animate() {

// box.rotation.x += 0.01;
// box.rotation.y += 0.01;

// renderer.render(scene, camera);
// }

let step = 0;

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLightHelper.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
