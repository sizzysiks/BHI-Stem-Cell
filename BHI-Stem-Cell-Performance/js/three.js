//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import * as THREE from "./three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { OrbitControls } from "./OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from "./GLTFLoader.js";

//Create a Three.JS Scene
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight
}

const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0); // adjust the y axis of camera set zero for human

// camera.zoom = 0.9;
// camera.updateProjectionMatrix();


//Keep track of the mouse position, so we can make the human move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
// mouse drag variable
let mouseDrag = false;

// event listiner for mouse down mousemove and mouseup
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

// implament listiner function for mouse mouseX and mouseY will update when mouse is clicked and dragged
function onMouseDown(event) {
  mouseDrag = true;
}

function onMouseMove(event) {
  if (mouseDrag) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}

function onMouseUp(event) {
  mouseDrag = false;
}

//Keep the 3D object on a global variable so we can access it later
let object;
let objectCenter;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'human';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;

    // Object 3d to wrap the model and get it's center
    const boundingBox = new THREE.Box3().setFromObject(object);
    const objectCenter = new THREE.Vector3();
    boundingBox.getCenter(objectCenter);
    object.position.sub(objectCenter);

    // scale the object to make it larger
    object.scale.set(900, 500, 900);

    // rotate the object to make it sit straight up
    object.rotation.x =0;
    // set position of human
    // object.position.set(0, 3, 0);
    // set position of hulk
    object.position.set(0, 0, 0);

    // Traverse the scene and change colors
    // object.traverse((child)=>{
    //   if(child instanceof THREE.Mesh){
    //     child.material.color = new THREE.Color('#ff0000')
    //   }
    // })
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
      // Set the mesh material to a marble glossy white material
      child.material = new THREE.MeshStandardMaterial({
      // color: '#FFFFFF', // white color
      // metalness: 0.5, // low metalness for marble-like appearance
      // roughness: 0.2, // slightly rough for a glossy finish
      });
      }
      });
    scene.add(object);   
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

/**
 * Points in 3d. Each point corresponds to a specific html element with it'w own position in 3d
 */
// human points
const points = [
  {
    position: new THREE.Vector3(2, 3, 0),
    element: document.querySelector('#point-1')
  },
  {
    position: new THREE.Vector3(3, 0.2, 0),
    element: document.querySelector('#point-2')
  },
  {
    position: new THREE.Vector3(-1.8, 4.5, -0.2),
    element: document.querySelector('#point-3')
  },
  {
    position: new THREE.Vector3(-0.8, -5.5, 0),
    element: document.querySelector('#point-4')
  },
  {
    position: new THREE.Vector3(2, -4, 0),
    element: document.querySelector('#point-5')
  },
  {
    position: new THREE.Vector3(2, -1.5, 0),
    element: document.querySelector('#point-6')
  },
  {
    position: new THREE.Vector3(2.5, 4.5, -0.5),
    element: document.querySelector('#point-7')
  },
  {
    position: new THREE.Vector3(-2, 0.5, 0),
    element: document.querySelector('#point-8')
  },
  {
    position: new THREE.Vector3(1.2, 5.5, 0),
    element: document.querySelector('#point-9')
  },
  {
    position: new THREE.Vector3(0, 0, 0),
    element: document.querySelector('#point-10')
  },
]


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "human" ? 22 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 0.7); // (color, intensity)
topLight.position.set(0, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "human" ? 3 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "human") {
  controls = new OrbitControls(camera, renderer.domElement);
  
  // Limit up and down rotation
  controls.minPolarAngle = Math.PI / 2; // Block upward rotation
  controls.maxPolarAngle = Math.PI / 2; // Block downward rotation
  
  // Limit left and right rotation
  const rotationAngle = Math.PI / 4; // Adjust this value to set the allowed rotation angle to the left and right
  controls.minAzimuthAngle = -rotationAngle; // Limit left rotation
  controls.maxAzimuthAngle = rotationAngle; // Limit right rotation
  }
//Render the scene
function animate() {
  // requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "human") {
    //I've played with the constants here until it looked good 
    // object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    // object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  controls.update()

  // Points
  for (const point of points) {
    const screenPosition = point.position.clone();
    screenPosition.project(camera);
    const translateX = screenPosition.x * window.innerWidth / 2 - 200
    const translateY = -screenPosition.y * window.innerHeight / 2
    point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
  }

  // Renderer
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate)
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener('resize', () =>{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//add mouse position listener, so we can make the eye move
// document.onmousemove = (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// }

//Start the 3D rendering
animate();