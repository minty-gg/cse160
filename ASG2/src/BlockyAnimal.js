// ColoredPoints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor; 
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor; 
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas); // adding a flag to this

  // the flag tells the GL context abt which buffers to preserve rather than reallocating and clearing inbetween
  // makes the drawing a bit more smoother
  gl = canvas.getContext("webgl", { preserverDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL() {
  // all variables that connect ot GLSL:

  // Initialize shaders
  // "this compiles and installs our shader programs"
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  // a_Position and u_FragColor sets up the variables that we'll pass in
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrx');
    return;
  }

	// Get the storage location of u_GlobalRotateMatrix
	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
// const FISH = 3;


// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;

// slider angles
// let g_horAngle=0;
// let g_verAngle=0;
// let g_zAngle=0;
// let vertical = false;
// let horizontal = false;

// global mouse rotation
let g_globalX = 0;
let g_globalY=0;
let g_globalZ=0;
let g_origin = [0, 0];
//let g_globalAngle=0;

// arm/hand wave vars
let g_waveLAngle=0;
let g_waveRAngle=0;
let g_waveLAnimation = false;
let g_waveRAnimation = false;



let g_leftHand = 0;
let g_rightHand = 0;
let g_leftArm = 0;
let g_rightArm = 0;
let g_tail = false;
let g_tailAngle = 0;


// function to reset all variables back to their default values
function resetAll() {

  //g_horAngle=0;
  //g_verAngle=0;
  //g_zAngle=0;
  //vertical = false;
  //horizontal = false;

  g_globalX=0;
  g_globalY=0;
  g_globalZ=0;
  g_origin;

  g_waveLAngle=0;
  g_waveRAngle=0;
  g_waveLAnimation = false;
  g_waveRAnimation = false;

  g_leftHand = 0;
  g_rightHand = 0;
  g_leftArm = 0;
  g_rightArm = 0;
  g_tail = false;
  g_tailAngle = 0;

  renderAllShapes();
}

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {


  // calling renderAllShapes() will clear canvas after u click clear button
  // if only call g_shapesList(), it only resets list but doesn't clear canvas until your next click to add a point to canvas
  
	// Button Events
  document.getElementById('reset').onclick = function() {resetAll(); };
	document.getElementById('animationWaveLOnButton').onclick = function() {g_waveLAnimation = true;};
	document.getElementById('animationWaveLOffButton').onclick = function() {g_waveLAnimation = false;};
	document.getElementById('animationWaveROnButton').onclick = function() {g_waveRAnimation = true;};
	document.getElementById('animationWaveROffButton').onclick = function() {g_waveRAnimation = false;};
  document.getElementById('animationTailOnButton').onclick = function() {g_tail = true;};
	document.getElementById('animationTailOffButton').onclick = function() {g_tail = false;};
  // Color Slider Events
  
  
  // Size Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalY = this.value; renderAllShapes(); });
  document.getElementById('verSlide').addEventListener('mousemove', function() { g_globalX = this.value; renderAllShapes(); });
  document.getElementById('Z-axisSlide').addEventListener('mousemove', function() { g_globalZ = this.value; renderAllShapes(); });

  document.getElementById('leftArmSlide').addEventListener('mousemove', function() { g_leftArm = this.value; renderAllShapes(); });
	document.getElementById('rightArmSlide').addEventListener('mousemove', function() { g_rightArm = this.value; renderAllShapes(); });
  document.getElementById('leftHSlide').addEventListener('mousemove', function() { g_leftHand = this.value; renderAllShapes(); });
	document.getElementById('rightHSlide').addEventListener('mousemove', function() { g_rightHand = this.value; renderAllShapes(); });
}

// MAIN FUNCTION
function main() {

  // Set up canvas and gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // assign an Event function to this variable and define it
  canvas.onmousedown = originCoords;  // function(ev) {origin(ev)} // function(ev){ click(ev) };
  // canvas.onmousemove = click; // doesn't work properly
  canvas.onmousemove  = function(ev) { if(ev.buttons == 1) { click(ev) } }; // ev.button is set to 1 if button is held down

  // Specify the color for clearing <canvas>
  // canvas backgorund color is black
  gl.clearColor(90/255, 90/255, 90/255, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
	requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

// Called by browser repeatedly whenever it's time
function tick() {

	// Print some debug information so we know we are running
	// Save the current time
	g_seconds = performance.now()/1000.0-g_startTime;
	//console.log(g_seconds);

	// Update animation angles
	updateAnimationAngles();

	// Draw everything
	renderAllShapes();

	// Tell the browser to update again when it has time
	requestAnimationFrame(tick);
}

// Update the angle of everything if currently animated:
function updateAnimationAngles() {

  // if idle animation

  // left arm move
	if (g_waveLAnimation) {
		// g_waveLAngle = 10*Math.tan(g_seconds); // this could be an arm slash animation LOL
    g_waveLAngle = 90*Math.cos(g_seconds);
	}

  // right arm move
	if (g_waveRAnimation) {
		g_waveRAngle = 10*Math.cos(g_seconds);
	}

  // tail move
  if (g_tail) {
    g_tailAngle = 10*Math.cos(g_seconds);

  }


}


// a list of shapes that stores a list of points 
var g_shapesList = [];

// SOURCE: I referenced code from "The Prince -Jeffrey Gu" to get the mouse click to rotate my drawing
// https://people.ucsc.edu/~jrgu/asg2/blockyAnimal/BlockyAnimal.html
// lines 287 - 312 to understand how to implement the click and rotation
// Global angles

function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let coordinates = convertCoordinatesEventToGL(ev);
  g_globalX = g_globalX - coordinates[0]*360;
  g_globalY = g_globalY - coordinates[1]*360;

  renderAllShapes();
}

//SOURCE: I referenced code from "The Prince -Jeffrey Gu" to get the mouse click to rotate my drawing
// https://people.ucsc.edu/~jrgu/asg2/blockyAnimal/BlockyAnimal.html

// function to keep track of the origin of where the user clicked on the canvas
function originCoords(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    g_origin = [x, y];
}
// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  
  let temp = [x,y];
  x = (x - g_origin[0])/400;
  y = (y - g_origin[1])/400;
  g_origin = temp;

  return([x,y]);
}



// Draw every shape that is supposed to be in the canvas
// aka renderScene()
function renderAllShapes() {

	// Check the time at the start of this function (and use again later below)
	var startTime = performance.now();

	// Pass the matrix to u_ModelMatrix attribute
  //if (horizontal) {
  var globalRotMat = new Matrix4(); 
  globalRotMat.rotate(g_globalX,1,0,0); // x-axis
  globalRotMat.rotate(g_globalY,0,1,0); // y-axis
  globalRotMat.rotate(g_globalZ,0,0,1); // z-axis


  //}
  //else { 
    //if (vertical){
    //var globalRotMat = new Matrix4().rotate(1.0, 0.0, g_verAngle * (Math.PI/180), 0.0);
    //}
  //}
  //horizontal = false;
  //vertial = false;
	
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT );
	gl.enable(gl.DEPTH_TEST);

	// my blocky animal
  var head = new Cube();
  head.color = [1, 1, 1, 1];
  head.matrix.translate(-0.25, 0, 0);
  head.matrix.scale(0.5, 0.4, 0.25);

  //head.matrix.rotate();
  head.render();

  var nose = new Cube();
  nose.color = [130/255, 75/255, 0, 1];
  nose.matrix.setTranslate(-0.073, 0.1, -0.06);
  nose.matrix.scale(0.12, 0.08, 0.1);
  nose.render();

  var eyeL = new Cube();
  eyeL.color = [0, 0, 0, 1];
  eyeL.matrix.setTranslate(-0.185, 0.2, -0.025);
  eyeL.matrix.scale(0.07, 0.07, 0.05);
  eyeL.render();

  var eyeR = new Cube();
  eyeR.color = [0, 0, 0, 1];
  eyeR.matrix.setTranslate(0.089, 0.2, -0.025);
  eyeR.matrix.scale(0.07, 0.07, 0.05);
  eyeR.render();

  var eyeDotL = new Cube();
  eyeDotL.color = [1, 1, 1, 1];
  eyeDotL.matrix.setTranslate(-0.15, 0.24, -0.02511);
  eyeDotL.matrix.scale(0.02, 0.02, 0.03);
  eyeDotL.render();

  var eyeDotR = new Cube();
  eyeDotR.color = [1, 1, 1, 1];
  eyeDotR.matrix.setTranslate(0.099, 0.24, -0.02511);
  eyeDotR.matrix.scale(0.02, 0.02, 0.03);
  eyeDotR.render();

  var earL = new Cube();
  earL.color = [57/255, 88/255, 132/255, 1];
  earL.matrix.setTranslate(-0.28, 0.42, -0.001);
  earL.matrix.rotate(-90, 0, 0, 1);
  earL.matrix.scale(0.14, 0.14, 0.26);
  earL.renderT();

  // base of right ear
  var earR = new Cube();
  earR.color = [57/255, 88/255, 132/255, 1];
  earR.matrix.setTranslate(0.28, 0.42, -0.001);
  earR.matrix.rotate(180, 0, 0, 1);
  earR.matrix.scale(0.14, 0.14, 0.26);
  earR.renderT();

  // body
  var body = new Cube();
  body.color = [135/255, 201/255, 197/255, 1];
  body.matrix.translate(-0.2, -0.4, -0.001);
  body.matrix.scale(0.4, 0.4, 0.25);
  body.render();


  // these could be made into a cylinder
  // left upper parts of his body (the little bumps)
  var bodyL = new Cube();
  bodyL.color = [135/255, 201/255, 197/255, 1];
  bodyL.matrix.translate(-0.25, 0.03, -0.04);
  bodyL.matrix.rotate(-70, 0, 0, 1);
  bodyL.matrix.scale(0.1, 0.1, 0.16);
  bodyL.render();

  var bodyL2 = new Cube();
  bodyL2.color = [135/255, 201/255, 197/255, 1];
  bodyL2.matrix.translate(-0.27, 0.03, -0.04);
  bodyL2.matrix.rotate(-90, 0, 0, 1);
  bodyL2.matrix.scale(0.1, 0.1, 0.16);
  bodyL2.render();

  var bodyL3 = new Cube();
  bodyL3.color = [135/255, 201/255, 197/255, 1];
  bodyL3.matrix.translate(-0.139, 0.039, -0.04);
  bodyL3.matrix.rotate(-105, 0, 0, 1);
  bodyL3.matrix.scale(0.1, 0.1, 0.16);
  bodyL3.render();

  // right upper parts of his body
  var bodyR = new Cube();
  bodyR.color = [135/255, 201/255, 197/255, 1];
  bodyR.matrix.translate(0.21, -0.07, -0.04);
  bodyR.matrix.rotate(70, 0, 0, 1);
  bodyR.matrix.scale(0.1, 0.1, 0.16);
  bodyR.render();

  var bodyR2 = new Cube();
  bodyR2.color = [135/255, 201/255, 197/255, 1];
  bodyR2.matrix.translate(0.27, -0.075, -0.04);
  bodyR2.matrix.rotate(90, 0, 0, 1);
  bodyR2.matrix.scale(0.1, 0.1, 0.16);
  bodyR2.render();

  var bodyR3 = new Cube();
  bodyR3.color = [135/255, 201/255, 197/255, 1];
  bodyR3.matrix.translate(0.05, -0.087, -0.04);
  bodyR3.matrix.rotate(10, 0, 0, 1);
  bodyR3.matrix.scale(0.1, 0.1, 0.16);
  bodyR3.render();

  // left arm and finger (connected)
  var armL = new Cylinder();
  armL.matrix.setTranslate(-0.2, -0.05, 0.05)
  
  armL.matrix.rotate(90, 100, -30, 1);
  armL.matrix.rotate(g_waveLAngle, 0, -g_waveLAngle, 1); // animation left arm on off
  armL.matrix.rotate(-g_leftArm, g_leftArm, g_leftArm, 1);

  var armLcoords = new Matrix4(armL.matrix);  // intermediate matrix
  armL.matrix.scale(0.1, 0.1, 0.07);
  armL.render();

  // left finger
  var fingerL = new Cone();
  fingerL.color = [1, 1, 1, 1];
  fingerL.matrix = armLcoords;
  fingerL.matrix.translate(0.0, 0.0, 0.135); // left right, back front, up down
  
  fingerL.matrix.rotate(g_leftHand, g_leftHand, -g_leftHand, 1);  // slider move
  fingerL.matrix.rotate(0, 0, 0, 1);
  fingerL.matrix.scale(0.1, 0.1, 0.1);
  //fingerL.matrix.rotate(-g_leftArm, g_leftArm, g_leftArm, 1);
  fingerL.render();


  // right arm and finger (coonected)
  var armR = new Cylinder();

  armR.matrix.rotate(-g_waveRAngle, 0, 0, 1);
  var armRcoords = new Matrix4(armR.matrix);

  armR.matrix.translate(0.2, -0.03, 0.05);
  armR.matrix.rotate(100, 190, 140, 1);
  armR.matrix.scale(0.1, 0.1, 0.07);
  armR.render();

  var fingerR = new Cone();
  fingerR.color = [1, 1, 1,1];
  fingerR.matrix = armRcoords;
  fingerR.matrix.translate(0.285, -0.14, 0.03);
  fingerR.matrix.rotate(90, 190, 140, 1);
  fingerR.matrix.scale(0.1, 0.1, 0.1);
  fingerR.render();


  // feet
  var footL = new Cube();
  footL.color = [57/255, 88/255, 132/255, 1];
  footL.matrix.translate(-0.245, -0.45, -0.1);
  footL.matrix.rotate(-20, 0, 20, 1);
  footL.matrix.scale(0.2, 0.08, 0.15);
  footL.render();

  // uhh smth is wrong with the right foot i wanna push it back ;-;
  var footR = new Cube();
  footR.color = [57/255, 88/255, 132/255, 1];
  footR.matrix.translate(0.07, -0.45, -0.05);
  footR.matrix.rotate(-30, 0, -20, 1);
  footR.matrix.scale(0.2, 0.08, 0.15);
  footR.render();

  var tail = new Cube();
  tail.color = [57/255, 88/255, 132/255, 1];
  tail.matrix.translate(-0.1, -0.38, 0.35);
  tail.matrix.scale(0.2, 0.1, 0.3);
  tail.matrix.rotate(-10, 45, 0, 1);
  tail.matrix.rotate(-2.5*g_tailAngle, 5*g_tailAngle, 0, 1);  // animate tail to move
  tail.render();

  var butt = new Cube();
  butt.color = [57/255, 88/255, 132/255, 1];
  butt.matrix.translate(-0.105, -0.38, 0.255);
  butt.matrix.scale(0.21, 0.1, 0.1);
  butt.render();

  // eyebrows and mouth? for angry poke animation?
  // var mouthL = new Cube();
  // var mouthR = new Cube();

  // var browL = new Cube();
  // var browR = new Cube();




// ------------------
	// Draw a cube
	// var body = new Cube();
	// body.color = [1.0, 0.0, 0.0, 1.0];
	// body.matrix.translate(-0.25, -0.75, 0.0);
	// body.matrix.rotate(-5.0, 1.0, 0.0, 0.0);
	// body.matrix.scale(0.5, 0.3, 0.5);
	//body.render();

	// Draw a left arm
	// var yellow = new Cube();
	// yellow.color = [1.0, 1.0, 0.0, 1.0];
	// yellow.matrix.setTranslate(0.0, -0.5, 0.0);
	// yellow.matrix.rotate(-5.0, 1.0, 0.0, 0.0);
	// yellow.matrix.rotate(-g_yellowAngle, 0.0, 0.0, 1.0);

	
	// var yellowCoordinatesMat = new Matrix4(yellow.matrix);	// an intermediate matrix
	// yellow.matrix.scale(0.25, 0.7, 0.5);
	// yellow.matrix.translate(-0.5, 0.0, 0.0);
	// //yellow.render();

	// // test magenta (magenta)
	// var magenta = new Cube();
	// magenta.color = [1.0, 0.0, 1.0, 1.0];
	// magenta.matrix = yellowCoordinatesMat;
	// magenta.matrix.translate(0.0, 0.65, 0.0);
	// magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
	// magenta.matrix.scale(0.3, 0.3, 0.3);
	// magenta.matrix.translate(-0.5, 0.0, -0.001);
	//magenta.matrix.rotate(-30, 1.0, 0.0, 0.0);
	//magenta.matrix.scale(0.2, 0.4, 0.2);
	//magenta.render();
	 
	// A bunch of rotating cubes
	// var K = 10.0;
	// for (var i = 1; i < K; i++) {
	// 	var c = new Cube();
	// 	c.matrix.translate(-0.8, 1.9*i/K-1.0, 0);
	// 	c.matrix.rotate(g_seconds*100, 1, 1, 1);
	// 	c.matrix.scale(0.1, 0.5/K, 1.0/K);
	// 	//c.render();
	// }
// --------------------------------------------

	// Check the time at the end of the function, and show on web page
	var duration = performance.now() - startTime;
	sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {   // we take the text and its htmlID
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text; // send inner html to whatver the text was
}

