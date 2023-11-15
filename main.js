//import * as THREE from 'three';
//import * as THREE from "/node_modules/three/build/three.module.js";
//import * as THREE from "/node_modules/three";
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
//import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// -- Cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const material = new THREE.MeshNormalMaterial( { wireframe: true } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y -= 2.5;
scene.add( cube );
// -- Cube end

// -- Lines
// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );

// const scene = new THREE.Scene();

// const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( geometry, material );

// scene.add( line );
// -- Lines end

// -- 3D models
// import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';




let loadedModels = [];
let numOfModels = 10;
const loader = new GLTFLoader();

for(let i = 0; i < numOfModels; i++){
	// loader.load( 'assets/shiba/scene.gltf', function ( gltf ) {
	loader.load( 'https://raw.githubusercontent.com/BrosephMC/Brosephmc.github.io/main/assets/shiba/scene.gltf', function ( gltf ) {

		loadedModels[i] = gltf;
		scene.add( gltf.scene );
		gltf.scene.position.x = -numOfModels/2;
		gltf.scene.position.x += i;

	}, undefined, function ( error ) {

		console.error( error );

	} );
}
// -- 3D models end

function animate() {
	requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	cube.position.z = loadedModels[0].scene.position.z - 1;

	for(let i = 0; i < numOfModels; i++){
		loadedModels[i].scene.rotation.x += 0.01;
		loadedModels[i].scene.rotation.y += 0.005*i;
		loadedModels[i].scene.position.y = Math.sin(loadedModels[i].scene.rotation.y);
		if(Math.sin(loadedModels[i].scene.rotation.x/2) > 0){
			loadedModels[i].scene.position.z = Math.tan(loadedModels[i].scene.rotation.x);
		} else {
			loadedModels[i].scene.position.z = Math.tan(loadedModels[i].scene.rotation.y);
		}
		
	}

	renderer.render( scene, camera );
}
animate();