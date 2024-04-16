// ColoredPoints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

// Coordinates list for a FISH:
//let vFish = [0,0,0,
             //1,1,0];



// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const FISH = 3;
const INVERT = 4;

// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSegment=5;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // Button Events (Shape Type)
  document.getElementById('red').onclick = function () { g_selectedColor = [1.0,0.0,0.0,1.0]};
  document.getElementById('orange').onclick = function () { g_selectedColor = [1.0,0.5,0.0,1.0]};
  document.getElementById('yellow').onclick = function () { g_selectedColor = [1.0,1.0,0.0,1.0]};
  document.getElementById('green').onclick = function () { g_selectedColor = [0.0,1.0,0.0,1.0]}
  document.getElementById('blue').onclick = function () { g_selectedColor = [0.0,0.0,1.0,1.0]};
  document.getElementById('purple').onclick = function () { g_selectedColor = [0.6,0.1,0.8,1.0]};
  document.getElementById('clearButton').onclick = function () {g_shapesList=[]; renderAllShapes();};
  
  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  
  document.getElementById('fishButton').onclick = function() { drawFish(); };

  // calling renderAllShapes() will clear canvas after u click clear button
  // if only call g_shapesList(), it only resets list but doesn't clear canvas until your next click to add a point to canvas
  
  // Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/255; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/255; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/255; });
  
  // Size Slider Eents
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_selectedSegment = this.value; });
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
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// a list of shapes that stores a list of points 
var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function click(ev) {

  // Extract the event click and return it in WebGL coordinates

  let [x,y] = convertCoordinatesEventToGL(ev);
  //let a = x;
  //let b = y;

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

  // ---REPLACED WITH Point class^ -----
  // // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // // Instead: Store the color to g_colors array
  // // .slice() extracts text from one string and returns a new string
  // g_colors.push(g_selectedColor.slice()); // alternative: g_colors.push([g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]]);
  
  // // Store the size to the g_izes array
  // g_sizes.push(g_selectedSize);

  // ---REPLACE WITH g_sizes.push^ -------
  // // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }


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
function renderAllShapes() {

  // Check the time at the start of this function (and use again later below)
  var startTime = performance.now();

  // Clear <canvas>
  // Rendering the points
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // CHeck the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
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

// failed to draw a fish
function drawFish() {
  gl.clear(gl.COLOR_BUFFER_BIT);

   
  let v2 = new Triangle();
  v2.position[0.0, 0.0];
  v2.color = [1.0, 1.0, 0.0, 1.0]; // yellow
  v2.size = 0.0;
  v2.render();

  //yellow
  var vertices = new Float32Array([0.0, 0.0,   0.5, 0.0,   0.5, -0.2]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.0, 0.0,   0.0, -0.2,   0.5, -0.2]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.0, -0.2,   0.5, -0.2,   0.5, -0.4]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.0, -0.2,   0.0, -0.4,   0.5, -0.4]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, 0.0,   0.5, -0.1,   0.7, -0.1]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, 0.-0.3,   0.5, -0.4,   0.7, -0.3]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, 0.0,   0.5, -0.1,   0.7, -0.1]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, 0.-0.3,   0.5, -0.4,   0.7, -0.3]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, -0.1,   0.7, -0.1,   0.7, -0.3]);
  drawTriangle(vertices);

  var vertices = new Float32Array([0.5, 0.-0.3,   0.5, -0.1,   0.7, -0.3]);
  drawTriangle(vertices);



  // --------
  let v1 = new Triangle();  // color: orange
  v1.position = [0.0, 0.0]; // idk why but i need this apparently
  v1.color = [1.0, 0.6, 0.02, 1.0];
  v1.size = 0.0;
  v1.render();

  // orange
  vertices = new Float32Array([0.0, 0.0,   -0.2, -0.2,   0.0, -0.2]);
  drawTriangle(vertices);

  vertices = new Float32Array([-0.2, -0.2,   0.0, -0.2,   0.0, -0.4]);
  drawTriangle(vertices);

  vertices = new Float32Array([0.05, -0.2,   0.0, -0.2,   0.0, 0.0]);
  drawTriangle(vertices);

  vertices = new Float32Array([0.05, -0.2,   0.0, -0.4,   0.0, -0.2]);
  drawTriangle(vertices);


  vertices = new Float32Array([0.9, 0.0,   0.9, -0.1,   0.7, -0.1]);
  drawTriangle(vertices);

  vertices = new Float32Array([0.9, 0.-0.3,   0.9, -0.4,   0.7, -0.3]);
  drawTriangle(vertices);

  vertices = new Float32Array([0.7, -0.1,   0.9, -0.1,   0.9, -0.3]);
  drawTriangle(vertices);

  vertices = new Float32Array([0.9, 0.-0.3,   0.7, -0.1,   0.7, -0.3]);
  drawTriangle(vertices);


  // top fin
  vertices = new Float32Array([0.05, -0.005,   0.63, -0.005,   0.5, 0.2]);
  drawTriangle(vertices);

  // bottom fin
  vertices = new Float32Array([0.1, -0.35,   0.66, -0.66,   0.65, -0.43]);
  drawTriangle(vertices);


  let v3 = new Triangle();
  v3.position[0.0, 0.0];
  v3.color = [0.0, 0.0, 0.0, 1.0]; // yellow
  v3.size = 0.0;
  v3.render();
  // eye
  vertices = new Float32Array([0, -0.16,   -0.1, -0.16,   -0.5, -0.175]);
  drawTriangle(vertices);

}

  //g_shapesList = [];

  // let v1 = new Point();
  // v1.type = 'point';
  // v1.positon = [0, 0];
  // v1.color = [1.0, 0.6, 0.02, 1.0];
  // v1.size = 1.0;
  // g_shapesList[0] = v1;
  // // v1.render();

  // let v2 = new Point();
  // v2.type = 'point';
  // v2.positon = [-120, -120];
  // v2.color = [1.0, 0.6, 0.02, 1.0];
  // v2.size = 1.0;
  // g_shapesList[1] = v2;

  // let v3 = new Point();
  // v3.type = 'point';
  // v3.positon = [0, -120];
  // v3.color = [1.0, 0.6, 0.02, 1.0];
  // v3.size = 1.0;
  // g_shapesList[2] = v3;
