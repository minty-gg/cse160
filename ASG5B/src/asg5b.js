import * as THREE from 'three';
import { OBJLoader } from '../lib/OBJLoader.js';
import { MTLLoader } from '../lib/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//const fishURL = new URL('./Fish.glb', import.meta.url);

// HOF source/inspo: https://people.ucsc.edu/~capar/cse160/asg5/world.html

function main() {

	const canvas = document.querySelector( '#c' );
	//const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const renderer = new THREE.WebGLRenderer( {
		canvas, 
		antialias: true,
		alpha: true,
	});

	const fov = 75;
	const aspect = canvas.width/canvas.height; // the canvas default: width/height = 300/150 = 2
	const near = 0.1;
	const far = 150;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(-3, 10, 50);
	// camera.position.z = 10;
	// camera.position.y = 0;
	// camera.position.x = -2;

	const scene = new THREE.Scene();

	// orbit controls
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	// camera persective, need to import gui


	// 3 light sources:

	// 1) Directional Light
	// const dirColor = 0xFFFFFF;
	// const dirIntensity = 1;
	// const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
	// dirLight.position.set(0, 10, 0);	//idk
	// dirLight.target.position.set(-5, 0, 0);
	// scene.add(dirLight);
	// scene.add(dirLight.target);

	// Directional Light
	{

		const color = 0xFFFFFF;
		const intensity = 4;
        // to shine some light on cubes when it rotates
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( -1, 2, 4 ); // default light position is (0, 0, 0)
		scene.add( light );

	}
	// Ambient Light

	{
		const ambColor = 0x000000;
		const ambIntensity = 1;
		const ambLight = new THREE.AmbientLight(ambColor, ambIntensity);
		//const light = new THREE.AmbientLight(ambColor, ambIntensity);
		//light.position.set(3, 2, 3);
		ambLight.position.set(0, 0, 0);
		scene.add(ambLight);

		const ambLight2 = new THREE.AmbientLight(ambColor, ambIntensity);
		ambLight2.position.set(1, 2, 4);
		scene.add( ambLight2 );

	}

	// Hemisphere Light
	{
		const skyColor = 0xB1E1FF;
		const groundColor = 0xB97A20;
		const hIntensity = 3;
		const hLight = new THREE.HemisphereLight(skyColor, groundColor, hIntensity);
		scene.add(hLight);
	}

	
    // MAKE A SPHERE?
    // //const sphereScene = new THREE.Scene();
    // const geoSphere = new THREE.SphereGeometry( 0.5, 32,  16, 0, Math.PI *3, 0, Math.PI); 
    // geoSphere.translate(5, 4, 1);
	// // geoSphere.translate(5, 4, -10);
    // const materialSphere = new THREE.MeshBasicMaterial( { color: 0x8844aa } ); 
    // const sphere = new THREE.Mesh( geoSphere, materialSphere ); 
    //scene.add( sphere );

	// load 3d object here //
	//     ........		   //
	/////////////////////////



	// extrudeSettings from COPILOT!!  --> to make heart have depth (originally a 2d shape)
	const extrudeSettings = {
		steps: 2,
		depth: 0.2,
		bevelEnabled: true,
		bevelThickness: 1.0,
		bevelSize: 0.02,
		bevelSegments: 2
	};

	// ==== MAKE A HEART FUNCTION ========
	// SOURCE: https://threejs.org/docs/index.html?q=geometry#api/en/geometries/ShapeGeometry
	function makeHeart(c, xcoord, ycoord, zcoord, s, r){	// color, x, y, z, scale, Zrotate
		const x = 0, y = 0;
		const heartShape = new THREE.Shape();
		
		heartShape.moveTo( x + 5, y + 5 );
		heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
		heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
		heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
		heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
		heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
		heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

		const heart = new THREE.ExtrudeGeometry(heartShape, extrudeSettings); // line from Copilot for extrude shape to render!
		heart.scale(s, s, s);
		heart.rotateZ(r);

		const heartMaterial = new THREE.MeshPhongMaterial( { color: c} );
		const meshHeart = new THREE.Mesh(heart, heartMaterial );

		meshHeart.position.set(xcoord, ycoord, zcoord);
		scene.add(meshHeart);

	}
	// ===================================
	// heart scene add calls:
	makeHeart(0xff0000, 0, 3, 0, 0.3, -3); 	  // center heart
	makeHeart(0xff0000, 18, 20, -8, 0.1, -3); // right top small heart
	makeHeart(0xff0000, -18, 20, -8, 0.1, -3);
	// ------------------------


	// === MAKE A CUBE FUNCTION: ==========
	const boxWidth = 2; // used to be all 1
	const boxHeight = 2;
	const boxDepth = 2;

	function makeInstance( color, x , y, z, s) {
        // MeshPhong is affect by light, MeshBasic is not affected by lights
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const material = new THREE.MeshPhongMaterial( { color } );
		
		const scaledGeo = geometry.scale(s, s, s);
		const cube = new THREE.Mesh( scaledGeo, material );
		//cube.scale(s, s, s);
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;

		return cube;

	}
	// ===================================
 
	// ===  MAKE A SPHERE FUNCTION:  =====
	function makeSphere (color, x, y, z, s) {

		const material = new THREE.MeshPhongMaterial( { color } );
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(s, 100, 9, 0, Math.PI *3, 0, Math.PI), material);

		sphere.position.x = x;
		sphere.position.y = y;
		sphere.position.z = z;

		//sphere.scale(s, s, s);
		
		scene.add(sphere);

		return sphere;

	}
	// ==================================


	// ===== MAKE A CONE FUNCTION: =======
	// SOURCE: https://threejs.org/docs/index.html?q=geometry#api/en/geometries/ConeGeometry 
	function makeCone(c, x, y, z, r, h) {	// last two: radius and height
		const geometry = new THREE.ConeGeometry( r, h, 32 ); 	//  5, 20, 32
		const material = new THREE.MeshPhongMaterial( {color: c} );	// 0xffff00
		const cone = new THREE.Mesh(geometry, material ); scene.add( cone );

		cone.position.x = x;
		cone.position.y = y;
		cone.position.z = z;

		scene.add(cone);
		return cone;
	}


	// list of "cubes" for rotating shapes
	const cubes = [
		// makeInstance( geometry, 0x44aa88, 0 ), // greenish blue
        // makeInstance( geoSphere, 0xffff00, 1),

		makeInstance(0x8844aa, 8, 14, 3, 2.5),		// purple
		makeInstance(0xaa8844, 12, 0, -3, 1.5),		// yellow brown
		makeSphere(0x395884, -9, 15, 0, 1),			// osha navy blue
		
		makeSphere(0x87C9C5, 3, 11, -2, 1),			// turquoise
		makeCone(0xfffbb9, -20, 28, -5, 5, 5), 		// top left shell color cone
	];


	// background texture loader
	{
		const loaderBG = new THREE.TextureLoader();
		const textureBG = loaderBG.load(
			'cloudy_puresky.jpg',
			() => {

				textureBG.mapping = THREE.EquirectangularReflectionMapping;
				textureBG.colorSpace = THREE.SRGBColorSpace;
				scene.background = textureBG;

			} );
	}

	// osha texture cube
	const loader = new THREE.TextureLoader();
	loader.load('oshawott.JPG', (texture) => {
	texture.colorSpace = THREE.SRGBColorSpace;
	const material = new THREE.MeshBasicMaterial({
		map: texture,
	});
	
	//const osha = new THREE.Mesh(new THREE.SphereGeometry( 3, 25, 9 ), material);
	const osha = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
	osha.position.set(-20, 5, -3);
	
	scene.add(osha);
	cubes.push(osha);  // add to our list of cubes to rotate
	});

	// another osha texture cube
	const loader2 = new THREE.TextureLoader();
	loader2.load('happy_osha.png', (texture) => {
	texture.colorSpace = THREE.SRGBColorSpace;
	const material = new THREE.MeshBasicMaterial({
		map: texture,
	});
	
	//const osha = new THREE.Mesh(new THREE.SphereGeometry( 3, 25, 9 ), material);
	const osha2 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
	osha2.position.set(0, 25, -8);
	
	scene.add(osha2);
	cubes.push(osha2);  // add to our list of cubes to rotate
	});



	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001; // convert time to seconds


		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
