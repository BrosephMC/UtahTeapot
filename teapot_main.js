//https://poly.pizza/m/ahOO6wz8sV0
//Banana by Poly by Google [CC-BY] via Poly Pizza

//https://www.freepik.com/free-photo/grey-wall-texture-background_34521999.htm#query=bump%20texture%20sand&position=24&from_view=search&track=ais&uuid=ccc39811-8f5d-4064-85da-5c6412efe2ae"
//Image by kbza on Freepik

//https://poly.pizza/m/6XXj6DSBb08
//VR-Mobil by Vladimir Ilic [CC-BY] via Poly Pizza

//Cactus by Quaternius (https://poly.pizza/m/HsEJgRLQWX)

//Rock by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/dmRuyy1VXEv)

//Time Hotel 5.10 AviatorGlasses by S. Paul Michael [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/dAwE-2WVHIt)

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { TeapotGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/geometries/TeapotGeometry.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls  } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

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

//AUDIO
//https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/resources/engine_clip.mp3
const listener = new THREE.AudioListener();
camera.add(listener);

// const sound = new THREE.PositionalAudio(listener);
const sound = new THREE.Audio(listener);
//const sound2 = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/resources/engine.mp3', function (buffer) {
    sound.setBuffer(buffer);
	// sound.setLoop(true);
	// sound.setLoopStart(22);
	// sound.setLoopEnd(50);
	//sound2.setBuffer(buffer);
    //sound.setRefDistance(100);
});


// function playSound(position) {
//     const source = new THREE.PositionalAudio(listener);
//     source.setBuffer(sound.buffer); // Reuse the same buffer
//     source.setRefDistance(10);
//     source.position.copy(position); // Set the position of the source
// 	console.log(source.position)
// 	source.play();
// }

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
// const teapotMaterial = new THREE.MeshNormalMaterial({ wireframe: false })
const teapotMaterial = new THREE.MeshStandardMaterial({ 
	color: 0xffffff ,
	roughness: 0.1,
	metalness: 0.3
});

const giantTeaPot = new THREE.Mesh(teapotGeometry, teapotMaterial)
giantTeaPot.scale.x = 50;
giantTeaPot.scale.y = 50;
giantTeaPot.scale.z = 50;
giantTeaPot.position.x = -mapSize * 0.3;
giantTeaPot.position.y = 23;
giantTeaPot.position.z = mapSize * 0.3;
scene.add(giantTeaPot)

// SCOOTER
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

	}, undefined, function ( error ) {

		console.error( error );

	} );

loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/AviatorGlasses.glb', function ( glb ) {

	glb.scene.scale.x = 0.65
	glb.scene.scale.y = 0.65
	glb.scene.scale.z = 0.65
	glb.scene.position.z = -0.95

	scooter.add(glb.scene)

}, undefined, function ( error ) {

	console.error( error );

} );

const areaLight = new THREE.RectAreaLight(0xfff9f9, 40, 0.5, 0.5); //intensity, width, height
areaLight.position.set(0, 1.4, -1.4);
areaLight.rotation.set(-Math.PI / 4, 0, 0);
scooter.add(areaLight);


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
	const Biker = new THREE.Mesh(teapotGeometry, new THREE.MeshStandardMaterial({ 
		color: new THREE.Color(Math.random(), Math.random(), Math.random()),
		metalness: 0.1,
		roughness: 0.3, }))
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
// const loadedModels = [];
// let numOfModels = 100;
// for(let i = 0; i < numOfModels; i++){
// 	const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial)
// 	teapotMesh.castShadow = true
// 	teapotMesh.position.x = Math.random() * mapSize - mapSize/2
// 	teapotMesh.position.z = Math.random() * mapSize - mapSize/2
// 	teapotMesh.rotation.y = Math.random() * Math.PI * 2
// 	// teapotMesh.position.x = i/numOfModels * mapSize - mapSize/2
// 	// teapotMesh.position.z = i/numOfModels * mapSize - mapSize/2
// 	loadedModels[i] = teapotMesh
// 	scene.add(teapotMesh)
// }

// BUNCH OF Bananas
// const loadedModels = [];
// let numOfModels = 100;
// for(let i = 0; i < numOfModels; i++){
// 	loadedModels.push(new THREE.Object3D())
// 	loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/Banana.glb', function ( glb ) {

// 	glb.scene.castShadow = true
// 	glb.scene.scale.x = 0.01
// 	glb.scene.scale.y = 0.01
// 	glb.scene.scale.z = 0.01
// 	glb.scene.position.x = Math.random() * mapSize - mapSize/2
// 	glb.scene.position.z = Math.random() * mapSize - mapSize/2
// 	glb.scene.rotation.y = Math.random() * Math.PI * 2

// 	loadedModels[i] = glb.scene;
// 	scene.add( loadedModels[i] );

// 	}, undefined, function ( error ) {

// 		console.error( error );

// 	} );
// }

// BUNCH OF Cactus
const loadedCactus = [];
let numOfCactus = 80;
for(let i = 0; i < numOfCactus; i++){
	loadedCactus.push(new THREE.Object3D())
	loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/Cactus.glb', function ( glb ) {

	glb.scene.castShadow = false
	glb.scene.scale.x = Math.random() + 2
	glb.scene.scale.y = Math.random() + 2
	glb.scene.scale.z = Math.random() + 2
	glb.scene.position.x = Math.random() * mapSize - mapSize/2
	glb.scene.position.y = -1
	glb.scene.position.z = Math.random() * mapSize - mapSize/2
	glb.scene.rotation.y = Math.random() * Math.PI * 2

	loadedCactus[i] = glb.scene;
	scene.add( loadedCactus[i] );

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

// BUNCH OF Rocks
const loadedRocks = [];
let numOfRocks = 25;
for(let i = 0; i < numOfRocks; i++){
	loadedRocks.push(new THREE.Object3D())
	loader.load( 'https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/assets/Rock.glb', function ( glb ) {

	glb.scene.castShadow = false
	glb.scene.scale.x = Math.random()*4 + 2
	glb.scene.scale.y = Math.random()*2 + 2
	glb.scene.scale.z = Math.random()*4 + 2
	glb.scene.position.x = Math.random() * mapSize - mapSize/2
	glb.scene.position.y = 0.2*glb.scene.scale.y
	glb.scene.position.z = Math.random() * mapSize - mapSize/2
	glb.scene.rotation.y = Math.random() * Math.PI * 2

	loadedRocks[i] = glb.scene;
	scene.add( loadedRocks[i] );

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

//BOOSTS
// const bumpMap2 = new THREE.TextureLoader().load('https://raw.githubusercontent.com/BrosephMC/UtahTeapot/main/resources/texture1.jpg');
// let bumpMap2Scale = 0.5
// bumpMap2.repeat.set(bumpMap2Scale, bumpMap2Scale);
// bumpMap2.wrapS = bumpMap2Scale
// bumpMap2.wrapT = bumpMap2Scale

const rampGeometry = new THREE.BoxGeometry(5, 5, 5); //width, height, length
const rampMaterial = new THREE.MeshStandardMaterial({color: 0x10FFBF, transparent: true, opacity: 0.5})

// BUNCH OF BOOSTS
const loadedBoosts = [];
let numOfBoosts = 5;
for(let i = 0; i < numOfBoosts; i++){
	const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
	ramp.castShadow = false
	ramp.position.x = Math.random() * mapSize/2 - mapSize/4
	ramp.position.z = Math.random() * mapSize/2 - mapSize/4
	ramp.position.y = -3.4
	// ramp.position.x = i/numOfModels * mapSize - mapSize/2
	// ramp.position.z = i/numOfModels * mapSize - mapSize/2
	loadedBoosts[i] = ramp
	scene.add(ramp)
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
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.mapSize.width = 16384;
light.shadow.mapSize.height = 16384;
scene.add(light)

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

//SCOOTER CONTROLS
const folowDistance = 7;
let targetPosition = new THREE.Vector3();
let currentSpeed = 0;
let delay = 0;

function quickProximity(object1, object2, distance){
	if(Math.abs(object1.position.x - object2.position.x) < distance && 
	Math.abs(object1.position.z - object2.position.z) < distance && 
	Math.abs(object1.position.y - object2.position.y) < distance){
		return true
	}
	return false
}

let velY = 0
function updateScooter() {
	//console.log(scooter.position)

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
		if(scooter.rotation.z < 0.1 && currentSpeed > 0)
			scooter.rotation.z += currentSpeed/20
    }

    // Turn right when D is pressed
    if (keyState[68] && currentSpeed != 0) {
        scooter.rotation.y -= currentSpeed/5;
		if(scooter.rotation.z > -0.1 && currentSpeed > 0)
			scooter.rotation.z -= currentSpeed/20
    }

	if(!keyState[65] && !keyState[68]) { scooter.rotation.z *= 0.9 }
	if(Math.abs(scooter.rotation.z) < 0.0001){ scooter.rotation.z = 0 }

	if(currentSpeed != 0){
		currentSpeed *= scooter.position.y > 0 ? 0.99 : 0.97;
		sound.setPlaybackRate(Math.min(Math.abs(currentSpeed)*15, 1.8))
		sound.setVolume(currentSpeed*12)
		if(!sound.isPlaying)
			sound.play()
	}

	for(let i = 0; i < numOfBoosts; i++){
		if(quickProximity(scooter, loadedBoosts[i], 4)){
			currentSpeed = 0.4
			velY = 0.25
		}
	}

	for(let i = 0; i < numOfRocks; i++){
		if(quickProximity(scooter, loadedRocks[i], 2)){
			currentSpeed = -0.2
		}
	}

	for(let i = 0; i < numOfCactus; i++){
		if(quickProximity(scooter, loadedCactus[i], 1.5)){
			currentSpeed = -0.2
		}
	}

	for(let i = 0; i < numOfBikers; i++){
		if(quickProximity(scooter, loadedBikers[i], 1.5)){
			loadedBikers[i].rotation.y += 5
			currentSpeed = -0.2
		}
	}
	
	if(velY > -0.5) { velY -= 0.005 }
	if(scooter.position.y >= 0) { scooter.position.y += velY }
	if(scooter.position.y < 0) { scooter.position.y = 0 }
	// if(scooter.position.y > 1) { scooter.teapotRider.rotation.x += velY/20 }
	//console.log(velY)

	if(Math.abs(currentSpeed) < 0.0001){
		currentSpeed = 0
		sound.stop()
	}

	scooter.translateZ(-currentSpeed)
	//console.log('Current Speed:', currentSpeed);

	//camera
	const distanceToScooter = camera.position.distanceTo(scooter.position);

	if (distanceToScooter > folowDistance){
		targetPosition.copy(scooter.position);
		targetPosition.y += 4;
        const cameraSpeed = (distanceToScooter-folowDistance+0.3)/300;
		//console.log('Camera Speed:', cameraSpeed);
		camera.position.lerp(targetPosition, cameraSpeed);
	}

	orbitControls.target.copy(scooter.position);

}

//ANIMATE
let initializing = 0
let prevTime = performance.now();
function animate() {
	requestAnimationFrame( animate );

	const currentTime = performance.now();
	//const deltaTime = (currentTime - prevTime) / 1000;
    prevTime = currentTime;

	if(initializing < 20) { initializing += 1 }
	if(initializing >= 20)
	updateScooter();
	orbitControls.update();

	// for(let i = 0; i < numOfModels; i++){
	// 	loadedModels[i].position.y = Math.sin(currentTime/1000*2+i)*0.5;
	// 	loadedModels[i].rotation.y += 0.01;
	// }

	for(let i = 0; i < numOfBikers; i++){
		loadedBikers[i].translateZ(-0.08)
		if(Math.abs(loadedBikers[i].position.x) > mapSize*0.25 || Math.abs(loadedBikers[i].position.z) > mapSize*0.25){
			loadedBikers[i].rotation.y += 0.08/8;
		}
		//if(!sound.isPlaying)
		//sound.play()
		//playSound(loadedBikers[i].position)
	}

	if (keyState[32]) {
        camera.lookAt(giantTeaPot.position.x+50, 20, giantTeaPot.position.z);
    }

	renderer.render( scene, camera );
}
animate();