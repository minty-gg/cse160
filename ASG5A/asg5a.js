import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 1.6; // the canvas default: width/height
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
        // to shine some light on cubes when it rotates
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 ); // default light position is (0, 0, 0)
		scene.add( light );

	}

	const boxWidth = 0.5; // used to be all 1
	const boxHeight = 0.5;
	const boxDepth = 0.5;

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
		makeInstance( geometry, 0x44aa88, 0 ), // greenish blue
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

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
