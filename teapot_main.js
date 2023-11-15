import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { TeapotGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/geometries/TeapotGeometry.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls  } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

//SCENE SETUP
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

//CAMERA MOVEMENT
const movementSpeed = 0.1;
const arrowKeys = { left: 37, up: 38, right: 39, down: 40 };
const keyState = {};

window.addEventListener('keydown', (event) => {
    keyState[event.keyCode] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.keyCode] = false;
});

const controls = new OrbitControls(camera, renderer.domElement);

// CUBE
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const material = new THREE.MeshNormalMaterial( { wireframe: true } );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.y -= 2.5;
// scene.add( cube );


// Moped model
//https://poly.pizza/m/6XXj6DSBb08

//teapot
const teapotGeometry = new TeapotGeometry(0.5, 8)
const teapotMaterial = new THREE.MeshNormalMaterial({ wireframe: false })
const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial)
teapotMesh.position.y = -2.5
teapotMesh.position.x = -2.5
scene.add(teapotMesh)

const loadedModels = [];
let numOfModels = 10;
const loader = new GLTFLoader();

loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/VR-Mobil.glb', function ( glb ) {
	//loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/teapot.glb', function ( glb ) {

		//loadedModels = glb;
		scene.add( glb.scene );

		glb.scene.scale.x = 0.5
		glb.scene.scale.y = 0.5
		glb.scene.scale.z = 0.5

	}, undefined, function ( error ) {

		console.error( error );

	} );

let mapSize = 30
for(let i = 0; i < numOfModels; i++){
	const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial)
	//teapotMesh.position.x = -numOfModels/2;
	//teapotMesh.position.x += i;
	teapotMesh.position.x = Math.random() * mapSize - mapSize/2
	teapotMesh.position.z = Math.random() * mapSize - mapSize/2
	loadedModels[i] = teapotMesh
	scene.add(teapotMesh)
}

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(2, 2, 5)
scene.add(light)

let prevTime = performance.now();
function animate() {
	requestAnimationFrame( animate );

	const currentTime = performance.now();
    const deltaTime = (currentTime - prevTime) / 1000; // Convert to seconds
    prevTime = currentTime;

	// teapotMesh.material.transparent = true
	// teapotMesh.material.opacity = 0.5
	// console.log(teapotMesh)

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
	// cube.position.z = loadedModels[0].position.z - 1;

	for(let i = 0; i < numOfModels; i++){
		loadedModels[i].position.y = Math.sin(currentTime/1000);
	}
	
	if (keyState[arrowKeys.left]) {
        camera.position.x -= movementSpeed;
    }
    if (keyState[arrowKeys.right]) {
        camera.position.x += movementSpeed;
    }
    if (keyState[arrowKeys.up]) {
        camera.position.z -= movementSpeed;
    }
    if (keyState[arrowKeys.down]) {
        camera.position.z += movementSpeed;
    }

	renderer.render( scene, camera );
}
animate();