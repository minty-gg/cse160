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
let g_globalAngle=0;
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
//let g_selectedSegment=5;
//let g_fish = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {


  // calling renderAllShapes() will clear canvas after u click clear button
  // if only call g_shapesList(), it only resets list but doesn't clear canvas until your next click to add a point to canvas
  
	// Button Events
	document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};
	document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};
	document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};
	document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};

  // Color Slider Events
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
	document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
  // Size Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
  //document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegment = this.value; });
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
  canvas.onmousedown = click;  // function(ev){ click(ev) };
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
	if (g_yellowAnimation) {
		g_yellowAngle = 45*Math.sin(g_seconds);
	}
	if (g_magentaAnimation) {
		g_magentaAngle = 45*Math.sin(3*g_seconds);
	}
}

// a list of shapes that stores a list of points 
var g_shapesList = [];
function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);
  

  // Create and store the new point into shapes list
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  }
  else if (g_selectedType==CIRCLE) {
    point = new Circle();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segment = g_selectedSegment;
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}



// Draw every shape that is supposed to be in the canvas
// aka renderScene()
function renderAllShapes() {

	// Check the time at the start of this function (and use again later below)
	var startTime = performance.now();

	// Pass the matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0.0, 1.0, 0.0);
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
  head.render();

  var nose = new Cube();
  nose.color = [130/255, 75/255, 0, 1];
  nose.matrix.setTranslate(-0.073, 0.1, -0.05);
  nose.matrix.scale(0.12, 0.08, 0.1);
  nose.render();

  // mouth: can do later (need two vars)

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

  // upper parts of his body, can do later
  var bodyL = new Cube();
  var bodyR = new Cube();

  var armL = new Cube();
  var fingerL = new Cube();
  var fingerR = new Cube();
  var armR = new Cube();

  var footL = new Cube();
  var footR = new Cube();

// ------------------
	// Draw a cube
	// var body = new Cube();
	// body.color = [1.0, 0.0, 0.0, 1.0];
	// body.matrix.translate(-0.25, -0.75, 0.0);
	// body.matrix.rotate(-5.0, 1.0, 0.0, 0.0);
	// body.matrix.scale(0.5, 0.3, 0.5);
	//body.render();

	// Draw a left arm
	var yellow = new Cube();
	yellow.color = [1.0, 1.0, 0.0, 1.0];
	yellow.matrix.setTranslate(0.0, -0.5, 0.0);
	yellow.matrix.rotate(-5.0, 1.0, 0.0, 0.0);
	yellow.matrix.rotate(-g_yellowAngle, 0.0, 0.0, 1.0);

	
	var yellowCoordinatesMat = new Matrix4(yellow.matrix);	// an intermediate matrix
	yellow.matrix.scale(0.25, 0.7, 0.5);
	yellow.matrix.translate(-0.5, 0.0, 0.0);
	//yellow.render();

	// test magenta (magenta)
	var magenta = new Cube();
	magenta.color = [1.0, 0.0, 1.0, 1.0];
	magenta.matrix = yellowCoordinatesMat;
	magenta.matrix.translate(0.0, 0.65, 0.0);
	magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
	magenta.matrix.scale(0.3, 0.3, 0.3);
	magenta.matrix.translate(-0.5, 0.0, -0.001);
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

