import * as THREE from '../lib/three.module.js';
// import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
//import { OBJLoader } from '../lib/OBJLoader.js';
//import { MTLLoader } from '../lib/MTLLoader.js';



function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 1.6; // the canvas default: width/height = 300/150 = 2
	const near = 1;
	const far = 15;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 10;
	camera.position.y = 0;
	camera.position.x = 0;

	// camera persective, need to import gui

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
        // to shine some light on cubes when it rotates
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 ); // default light position is (0, 0, 0)
		scene.add( light );

	}

    // MAKE A SPHERE?
    // const sphereScene = new THREE.Scene();
    const geoSphere = new THREE.SphereGeometry( 0.5, 32,  16, 0, Math.PI *3, 0, Math.PI); 
    geoSphere.translate(5, 4, 1);
    const materialSphere = new THREE.MeshBasicMaterial( { color: 0x8844aa } ); 
    const sphere = new THREE.Mesh( geoSphere, materialSphere ); 
    scene.add( sphere );

	// make shapeGeometry for heart
	const x = 0, y = 0;

	const heartShape = new THREE.Shape();

	
	heartShape.moveTo( x + 5, y + 5 );
	heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
	heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
	heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
	heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
	heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
	heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

	const heart = new THREE.ShapeGeometry( heartShape );
	heart.scale(0.2, 0.2, 0.2);
	//heart.rotateX(1);
	//heart.rotateY();
	heart.rotateZ(-3);	//10.75
	heart.translate(3, 3, 0);
	const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	const mesh = new THREE.Mesh(heart, material ) ;
	scene.add( mesh );

    // TO LOAD FISHY OBJ FILE? errr it's not working..
	// const mtlLoader = new MTLLoader();
	// mtlLoader.load('Goldfish_01.mtl', (mtl) => {
	// 	mtl.preload();
	// 	objLoader.setMaterials(mtl);
	
	// 	const objLoader = new OBJLoader();
	// 	objLoader.load( 'Goldfish_01.obj', ( root ) => {

	// 		scene.add( root );

	// 	} );
	// } );
	

	const boxWidth = 1; // used to be all 1
	const boxHeight = 1;
	const boxDepth = 1;

	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	
	function makeInstance( geometry, color, x ) {
        // MeshPhong is affect by light, MeshBasic is not affected by lights
		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

	const cubes = [
		// makeInstance( geometry, 0x44aa88, 0 ), // greenish blue
		//makeInstance( geometry, 0x8844aa, -3.5 ),
		makeInstance( geometry, 0xaa8844, 6),
       // makeInstance( geoSphere, 0xffff00, 1),
	];

	// osha cube/sphere
	const loader = new THREE.TextureLoader();
	loader.load('oshawott.JPG', (texture) => {
	texture.colorSpace = THREE.SRGBColorSpace;
	const material = new THREE.MeshBasicMaterial({
		map: texture,
	});
	const osha = new THREE.Mesh(new THREE.SphereGeometry( 3, 25, 9 ), material);
	scene.add(osha);
	osha.position.x = -3.5;
	cubes.push(osha);  // add to our list of cubes to rotate
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
