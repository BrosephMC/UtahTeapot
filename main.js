import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// CUBE
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const material = new THREE.MeshNormalMaterial( { wireframe: true } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y -= 2.5;
scene.add( cube );

// 3D MODELS
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

// Moped model
//https://poly.pizza/m/6XXj6DSBb08


let loadedModels = [];
let numOfModels = 10;
const loader = new GLTFLoader();

for(let i = 0; i < numOfModels; i++){
	//loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/VR-Mobil.glb', function ( glb ) {
	loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/teapot.glb', function ( glb ) {

		loadedModels[i] = glb;
		scene.add( glb.scene );

		glb.scene.scale.x = 0.4
		glb.scene.scale.y = 0.4
		glb.scene.scale.z = 0.4

		glb.scene.position.x = -numOfModels/2;
		glb.scene.position.x += i;

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(2, 2, 5)
scene.add(light)


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