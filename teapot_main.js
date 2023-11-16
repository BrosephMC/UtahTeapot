//https://poly.pizza/m/ahOO6wz8sV0
//Banana by Poly by Google [CC-BY] via Poly Pizza

//https://www.freepik.com/free-photo/grey-wall-texture-background_34521999.htm#query=bump%20texture%20sand&position=24&from_view=search&track=ais&uuid=ccc39811-8f5d-4064-85da-5c6412efe2ae"
//Image by kbza on Freepik

//https://poly.pizza/m/6XXj6DSBb08
//VR-Mobil by Vladimir Ilic [CC-BY] via Poly Pizza

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { TeapotGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/geometries/TeapotGeometry.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls  } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/math/ImprovedNoise.js';

const mapSize = 300

//SCENE SETUP
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

//CAMERA MOVEMENT
const keyState = {};

window.addEventListener('keydown', (event) => {
    keyState[event.keyCode] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.keyCode] = false;
});

const orbitControls = new OrbitControls(camera, renderer.domElement);
const initialTarget = new THREE.Vector3(5, 0, 5);
orbitControls.target.copy(initialTarget);
orbitControls.enableKeys = false;

//SKYBOX
const cubeLoader = new THREE.CubeTextureLoader();
const texture = cubeLoader.load([
	'./resources/posx.jpg',
	'./resources/negx.jpg',
	'./resources/posy.jpg',
	'./resources/negy.jpg',
	'./resources/posz.jpg',
	'./resources/negz.jpg',
]);
scene.background = texture;

//GROUND PLANE

const bumpMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/resources/texture1.jpg');
let bumpMapScale = 20
bumpMap.repeat.set(bumpMapScale, bumpMapScale);
bumpMap.wrapS = bumpMapScale
bumpMap.wrapT = bumpMapScale
// const bumpMap = new THREE.TextureLoader().load('./resources/texture1.jpg');

const planeGeometry = new THREE.PlaneGeometry(mapSize, mapSize, 64, 64);

const planeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0xD8B48C,
	map: generateNoiseTexture(1024, 1024, 150, 1),
    bumpMap: bumpMap,
    bumpScale: 3,
    metalness: 0.6,
    roughness: 0.7,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

function generateNoiseTexture(width, height, baseColor, contrast) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Generate a random value with reduced contrast
        const value = Math.floor(baseColor + Math.random() * (255 - baseColor) * contrast);

        // Set RGB values with the same color to reduce contrast
        data[i] = data[i + 1] = data[i + 2] = value;

        // Set full opacity (255) for the alpha channel
        data[i + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // Adjust the repeat values as needed for tiling

    return texture;
}

//TEAPOT
const teapotGeometry = new TeapotGeometry(0.5, 8)
const teapotMaterial = new THREE.MeshNormalMaterial({ wireframe: false })

const giantTeaPot = new THREE.Mesh(teapotGeometry, teapotMaterial)
giantTeaPot.scale.x = 50;
giantTeaPot.scale.y = 50;
giantTeaPot.scale.z = 50;
giantTeaPot.position.x = -mapSize * 0.25;
giantTeaPot.position.y = 23;
giantTeaPot.position.z = mapSize * 0.25;
scene.add(giantTeaPot)

// Moped model


const scooter = new THREE.Object3D();
scene.add(scooter);

const loader = new GLTFLoader();
loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/VR-Mobil.glb', function ( glb ) {

		const teapotRider = new THREE.Mesh(teapotGeometry, teapotMaterial)
		glb.scene.scale.x = 0.65
		glb.scene.scale.y = 0.65
		glb.scene.scale.z = 0.65
		glb.scene.rotation.y = -Math.PI / 2
		teapotRider.position.y = 0.8

		scooter.add(glb.scene)
		scooter.add(teapotRider)
		//scene.add( glb.scene );

	}, undefined, function ( error ) {

		console.error( error );

	} );

// BUNCH OF BIKERS
const loadedBikers = [];
let numOfBikers = 10;
for(let i = 0; i < numOfBikers; i++){
	loadedBikers.push(new THREE.Object3D())
	loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/VR-Mobil.glb', function ( glb ) {

	glb.scene.scale.x = 0.65
	glb.scene.scale.y = 0.65
	glb.scene.scale.z = 0.65
	glb.scene.rotation.y = -Math.PI / 2
	const Biker = new THREE.Mesh(teapotGeometry, teapotMaterial)
	Biker.position.y = 0.8

	loadedBikers[i].add(glb.scene)
	loadedBikers[i].add(Biker)

	}, undefined, function ( error ) {

		console.error( error );

	} );

	loadedBikers[i].position.x = Math.random() * mapSize/2 - mapSize/4
	loadedBikers[i].position.z = Math.random() * mapSize/2 - mapSize/4
	loadedBikers[i].rotation.y = Math.random() * Math.PI * 2
	scene.add(loadedBikers[i]);
}


// BUNCH OF TEAPOTS
const loadedModels = [];
let numOfModels = 100;
for(let i = 0; i < numOfModels; i++){
	const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial)
	teapotMesh.castShadow = true
	teapotMesh.position.x = Math.random() * mapSize - mapSize/2
	teapotMesh.position.z = Math.random() * mapSize - mapSize/2
	teapotMesh.rotation.y = Math.random() * Math.PI * 2
	// teapotMesh.position.x = i/numOfModels * mapSize - mapSize/2
	// teapotMesh.position.z = i/numOfModels * mapSize - mapSize/2
	loadedModels[i] = teapotMesh
	scene.add(teapotMesh)
}

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(0, 5, 0)
light.castShadow = true
light.shadow.camera.near = 0.1;
light.shadow.camera.far = mapSize;
light.shadow.camera.left = -mapSize;
light.shadow.camera.right = mapSize;
light.shadow.camera.top = mapSize;
light.shadow.camera.bottom = -mapSize;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
// light.shadow.mapSize.width = 16384;
// light.shadow.mapSize.height = 16384;
scene.add(light)

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

//SCOOTER CONTROLS
const folowDistance = 7;
let targetPosition = new THREE.Vector3();
let currentSpeed = 0;

function updateScooter() {
    const speed = 0.1;

    // Move forward when W is pressed
    if (keyState[87]) {
		if(currentSpeed < 0.1){
			currentSpeed += 0.005;
		}
    }

	// Move backward when S is pressed
	if (keyState[83]) {
		if(currentSpeed > -0.02){
			currentSpeed -= 0.001;
		}
	}

    // Turn left when A is pressed
    if (keyState[65] && currentSpeed != 0) {
        scooter.rotation.y += currentSpeed/5;
    }

    // Turn right when D is pressed
    if (keyState[68] && currentSpeed != 0) {
        scooter.rotation.y -= currentSpeed/5;
    }

	if(currentSpeed != 0){
		currentSpeed *= 0.97;
	}
	if(Math.abs(currentSpeed) < 0.00001){
		currentSpeed = 0
	}
	scooter.translateZ(-currentSpeed)
	console.log('Current Speed:', currentSpeed);

	const distanceToScooter = camera.position.distanceTo(scooter.position);

	if (distanceToScooter > folowDistance){
		targetPosition.copy(scooter.position);
		targetPosition.y += 4;
        const cameraSpeed = (distanceToScooter-folowDistance+0.3)/300;
		console.log('Camera Speed:', cameraSpeed);
		camera.position.lerp(targetPosition, cameraSpeed);
	}

	orbitControls.target.copy(scooter.position);

}

//ANIMATE
let prevTime = performance.now();
function animate() {
	requestAnimationFrame( animate );

	const currentTime = performance.now();
	//const deltaTime = (currentTime - prevTime) / 1000;
    prevTime = currentTime;

	updateScooter();
	orbitControls.update();
    //camera.lookAt(scooter.position);

	for(let i = 0; i < numOfModels; i++){
		loadedModels[i].position.y = Math.sin(currentTime/1000*2+i)*0.5;
		loadedModels[i].rotation.y += 0.01;
	}

	for(let i = 0; i < numOfBikers; i++){
		loadedBikers[i].translateZ(-0.08)
		if(Math.abs(loadedBikers[i].position.x) > mapSize*0.25 || Math.abs(loadedBikers[i].position.z) > mapSize*0.25){
			loadedBikers[i].rotation.y += 0.08/8;
		}
		//loadedBikers[i].position.y = Math.sin(currentTime/1000*2+i)*0.5;
		//loadedBikers[i].rotation.y += 0.01;
	}

	renderer.render( scene, camera );
}
animate();