// continuing from asg2

// ColoredPoints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
	uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
	uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    //mat4 NormalMatrix = transpose(inverse(u_ModelMatrix));
    //v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;

  }`
// passing a_UV (a JS var vector shader) into a varying var v_UV (var for fragment shader)

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor; 
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {

    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);   // Use normal debug color
    }

    else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                   // Use color
    }

    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);          // Use UV debug color
    }

    else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);   // Use texture0
    }

    else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);   // Use texture1

    }
    else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);   // Use texture2
    }

    else {
      gl_FragColor = vec4(1, 0.2, 0.2, 1);          // Error, put Redish debugging color
    }


    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // === Red/Green Distance Visualization ===
    // if (r < 1.0) {
    //   gl_FragColor = vec4(1,0,0,1); // set to red
    // }
    // else if (r < 2.0) {
    //   gl_FragColor = vec4(0,1,0,1); // set to green
    // }

    // === Light Falloff Visualization 1/r^2 ===
    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1);




    // === N dot L ===
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);
    gl_FragColor = gl_FragColor * nDotL;
    gl_FragColor.a = 1.0;


    // REFLECTION
    vec3 R = reflect(-L,N);

    // eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // SPECULAR
    float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;


    // DIFFUSE and AMBIENT
    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;

    if (u_lightOn) {
      if (u_whichTexture == 0) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }
      else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }

    

    

  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor; 
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;


function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas); // adding a flag to this
  
  
  gl = canvas.getContext("webgl", { preserverDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
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

  // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

	// Get the storage location of u_GlobalRotateMatrix
	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
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

// global mouse rotation
let g_globalX = 0;
let g_globalY=0;
let g_globalZ=0;
let g_origin = [0, 0];
let g_globalAngle=0;

// arm/hand wave animation
let g_waveLAngle=0;
let g_waveRAngle=0;
let g_waveLAnimation = false;
let g_waveRAnimation = false;


// arm/hand sliders
let g_leftHand = 0;
let g_rightHand = 0;
let g_leftArm = 0;
let g_rightArm = 0;
let g_tail = false;
let g_tailAngle = 0;

// SOURCE: i also referenced/implemented animations based off how "The Prince -Jeffrey Gu" did their animation
// idle animation + angles
let g_speed = 1;
let g_idleAnimation = false; 
let g_idleBody=0; // make body bob forward and backward
let g_idleHead=0; // make the head bob a bit side to side and forward/back?
let g_idleFeet=0;

// initilize camera
var g_camera = new Camera();

// normal on/off
let g_normalOn = false;
let g_lightPos = [0, 1, -2];  // original
//let g_lightPos = [0, 2, -1]; 
//let g_lightPos = [2, -1, 1];
let g_lightOn = true;


// function to reset all variables back to their default values
function resetAll() {


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

  g_speed =1;
  g_idleAnimation = false;
  g_idleBody=0;
  g_idleHead=0;
  g_idleFeet=0;

  g_eye = [0, 0, -3];
  g_at = [0, 0, -100];
  g_up = [0, 1, 0];
  g_camera = new Camera();
  g_normalOn = false;
  g_lightPos = [0, 1, -2]; 
  g_globalAngle=0;
  g_lightOn = true;

  renderAllShapes();
}

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // calling renderAllShapes() will clear canvas after u click clear button
  // if only call g_shapesList(), it only resets list but doesn't clear canvas until your next click to add a point to canvas
  
	// Button Events
  document.getElementById('normalOn').onclick = function() {g_normalOn = true;}; 
  document.getElementById('normalOff').onclick = function() {g_normalOn = false};
  document.getElementById('lightOn').onclick = function() {g_lightOn = true;}; 
  document.getElementById('lightOff').onclick = function() {g_lightOn = false}; 

  document.getElementById('reset').onclick = function() {resetAll(); };
  document.getElementById('idle').onclick = function() { g_idleAnimation = true; };
  document.getElementById('giveup').onclick = function() { g_camera.eye = new Vector3([0, 0, -1.5]); g_camera.at = new Vector3([0, 0, 100]); g_camera.up = new Vector3([0, 1, 0]); };
	document.getElementById('animationWaveLOnButton').onclick = function() {g_waveLAnimation = true;};
	document.getElementById('animationWaveLOffButton').onclick = function() {g_waveLAnimation = false;};
	document.getElementById('animationWaveROnButton').onclick = function() {g_waveRAnimation = true;};
	document.getElementById('animationWaveROffButton').onclick = function() {g_waveRAnimation = false;};
  document.getElementById('animationTailOnButton').onclick = function() {g_tail = true;};
	document.getElementById('animationTailOffButton').onclick = function() {g_tail = false;};
  
  // Light Slider Events
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes();}})
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) {click(ev)}};



  // Size Slider Events
  // angle slide is horizontal camera angle
  document.getElementById('angleSlide').addEventListener('input', function() { g_globalY = this.value; g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('verSlide').addEventListener('input', function() { g_globalX = this.value; renderAllShapes(); });
  document.getElementById('Z-axisSlide').addEventListener('input', function() { g_globalZ = this.value; renderAllShapes(); });


  document.getElementById('leftArmSlide').addEventListener('input', function() { g_leftArm = this.value; renderAllShapes(); });
	document.getElementById('rightArmSlide').addEventListener('input', function() { g_rightArm = this.value; renderAllShapes(); });
  document.getElementById('leftHSlide').addEventListener('input', function() { g_leftHand = this.value; renderAllShapes(); });
	document.getElementById('rightHSlide').addEventListener('input', function() { g_rightHand = this.value; renderAllShapes(); });
}


function initTextures() {
  
  // Create the image object
  var image0 = new Image();
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image0.onload = function() { sendImageToTEXTURES(image0, 0); } // function runs after loading complete
  // Tell the browser to load an image
  image0.src = 'textures/sky_cloud.jpg';

  // Add more texture loadings later (if needed)

  var image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image2 object');
    return false;
  }
  image1.onload = function () { sendImageToTEXTURES(image1, 1); }
  image1.src = 'textures/grass_texture.jpeg';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  image2.onload = function () { sendImageToTEXTURES(image2, 2); }
  image2.src = 'textures/hedge.jpg';

  return true;
}

function sendImageToTEXTURES(image, textureNum) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  if (textureNum == 0) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-xis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);  // total of 8 texture units 
    // Bind the texture object to the targeet
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
    console.log('finished loadTexture0');

  }
  if (textureNum == 1) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-xis
    gl.activeTexture(gl.TEXTURE1);  // change for each texture
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);  // change for each texture
    console.log('finished loadTexture1');
  }
  if (textureNum == 2) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-xis
    gl.activeTexture(gl.TEXTURE2);  // change for each texture
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler2, 2);  // change for each texture
    console.log('finished loadTexture2');
  }

}



// MAIN FUNCTION
function main() {

  // Set up canvas and gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();


  // SOURCE from Copilot: implementing camera movement with mouse
  var mouseX = null;
  var mouseY = null;
  //var mouseZ = null;
  var mouseDown = false;

  canvas.onmousedown = function(ev) {
    mouseDown = true;
    mouseX = ev.clientX;
    mouseY = ev.clientY;
    //mouseZ = ev.clientZ;
  };

  canvas.onmouseup = function(ev) {
    mouseDown = false;
  };

  canvas.onmousemove = function(ev) {
    if (mouseDown) {
      // updated values of xyz
      var newX = ev.clientX;
      var newY = ev.clientY;
      //var newZ = ev.clientZ;

      g_camera.at.elements[0] += (newX - mouseX) * 0.5;
      g_camera.at.elements[1] += (newY - mouseY) * 0.5;
      //g_camera.at.elements[2] += (newZ - mouseZ) * 0.5;

      mouseX = newX;
      mouseY = newY;
      //mouseZ = newZ;

      renderAllShapes();
    }
  };

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  // canvas backgorund color is black
  gl.clearColor(90/255, 90/255, 90/255, 1.0);
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
  if (g_idleAnimation) {
    g_idleBody = 10*Math.cos(g_seconds);
    g_waveLAngle = 10*Math.cos(g_seconds);
    g_waveRAngle = 10*Math.cos(g_seconds);
    g_tailAngle = 10*Math.cos(g_seconds);
    g_idleFeet = 15*Math.cos(g_seconds);
  }

  // left arm move
	if (g_waveLAnimation) {
		// g_waveLAngle = 10*Math.tan(g_seconds); // this could be an arm slash animation LOL
    g_waveLAngle = 90*Math.cos(g_seconds);
	}

  // right arm move
	if (g_waveRAnimation) {
		g_waveRAngle = 90*Math.sin(g_seconds);
	}

  // tail move
  if (g_tail) {
    g_tailAngle = 10*Math.cos(g_seconds);

  }

  // animate lighting
  //if (g_lightOn) {
  g_lightPos[0] = Math.cos(g_seconds);
  //}
  

}

// a list of shapes that stores a list of points 
var g_shapesList = [];


// to move around with WASD 
function keydown(ev) {
  // W = 87, A = 65, S = 83, D = 68
  
  if (ev.keyCode == 68) {   // right 
    //g_camera.eye.elements[0] += 0.2;
    g_camera.right();
  }
  else if (ev.keyCode == 65) {  // left
    //g_camera.eye.elements[0] -= 0.2;
    g_camera.left();
  }

  else if (ev.keyCode == 83) {  // back
    //g_camera.eye.elements[2] -= 0.2;
    g_camera.back();
  }

  else if (ev.keyCode == 87) {
    //g_camera.eye.elements[2] += 0.2;  // forward
    g_camera.forward();
  }

  // else if keyCode is for Q: rotate left
  else if (ev.keyCode == 81) {
    g_camera.panLeft();
  }

  // else if keyCode is for E: rotate right
  else if (ev.keyCode == 69) {
    g_camera.panRight();
  }
  // x = 88, z = 90
  // for up and down angle
  else if (ev.keyCode == 88) {
    //g_camera.at.elements[1] -= 2;   // rotate down?
    g_camera.panDown();
  }
  else if (ev.keyCode == 90) {
    //g_camera.at.elements[1] += 2;   // rotate up?
    g_camera.panUp();
  }

  // move up and down
  // up arrow = 38
  // down arrow = 40
  else if (ev.keyCode == 38) {
    g_camera.eye.elements[1] += 0.2;
  }
  else if (ev.keyCode == 40) {
    g_camera.eye.elements[1] -= 0.2;
  }


  // add and delete blocks
  // m = add block
  else if (ev.keyCode == 77) {

  }
  // n = delete block
  else if (ev.keyCode == 78) {

  }
  
  renderAllShapes();
  console.log(ev.keyCode);
}

// map for canvas
var g_map = [

[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //4
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //5
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //7
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //15
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //16
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //17
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //18
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //19
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //20
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], //21
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //22
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //23
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //24
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //25
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //26
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //27
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //28
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //29
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //30
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //31
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //32

];


function drawMap() {
  // old one
    for (x = 0; x < 32; x++) {
      for (y = 0; y < 32; y++) {
        //console.log(x,y);
        if (g_map[x][y] ==  1) {
        //if (x < 1 || x == 31 || y == 0 || y ==31) { 
          var wall = new Cube();
          //wall.color = [0.8, 1.0, 1.0, 1.0];
          wall.textureNum = 2;
          wall.matrix.translate(0, -0.75, 0);
          wall.matrix.scale(0.3, 1.2, 0.3);
          wall.matrix.translate(x-16, 0, y-16);
          
          //wall.render();
        }
      }
    }
}

// Draw every shape that is supposed to be in the canvas
// aka renderScene()
function renderAllShapes() {

	// Check the time at the start of this function (and use again later below)
	var startTime = performance.now();

  // Pass the projection  matrix
  var projMat = new Matrix4();
  projMat.setPerspective(90, 1*canvas.width/canvas.height, .1, 100); // (90 deg wide, aspect = width/height, near plane = 0.1, far plane = 100)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2],   g_at[0], g_at[1], g_at[2],   g_up[0], g_up[1], g_up[2]);  // (eye, at, up)
  
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
    g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]);
  
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


	// Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4(); //.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalX,1,0,0); // x-axis
  globalRotMat.rotate(g_globalY,0,1,0); // y-axis
  globalRotMat.rotate(g_globalZ,0,0,1); // z-axis
	
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT );
	//gl.enable(gl.DEPTH_TEST); // do not uncomment this causes z-fighting on the floor!!


  // Pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  // Pass the camera position to GLSL
  gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

  // Pass the light status
  gl.uniform1i(u_lightOn, g_lightOn);

  // == DRAW CUBE AND SPHERE FOR LIGHTING ==

  // DRAW THE LIGHT w cube
  var light = new Cube();
  light.color = [2,2,0,1];
  
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  
  light.render();

  // SPHERE
  var sp = new Sphere();
  if (g_normalOn) {
    sp.textureNum = -3;
  }
  sp.matrix.translate(-1, -1.5, -1.5);
  //sp.matrix.scale(0.4, 0.4, 0.4);
  sp.render();

  // sp.normalMatrix.setInverseOf(sp.matrix).transpose(); // for normal matrix stuff


  // Copilot told me to consider drawing the sky first then the floor etc
  // ==== DRAW THE SKY ======
  var sky = new Cube();
  sky.color = [120/255, 120/255, 120/255, 1.0];
  if (g_normalOn) {
    sky.textureNum = -3;
  }
  else {
    //sky.color = [1,1,1,1];
    sky.textureNum = 0;
  }
  
  sky.matrix.scale(-15, -15, -15);   // to invert the normal colors, in this case do scale(-50, -50, -50)
  sky.matrix.translate(-0.5, -0.5, -0.5);
  
  sky.render();

  // == DRAW THE FLOOR ==
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -2.49, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5 );
  
  floor.render();

  // =====  DRAW MAP  ==========
  // drawMap();
  

  
  
  

	// ======= MY BLOCKY ANIMAL: ==============
  var head = new Cube();
  head.color = [1, 1, 1, 1];
  // head.textureNum = -1;    // sets to texture num
  if (g_normalOn) {
    head.textureNum = -3;
  }
  head.matrix.translate(-0.25, 0, 0);
  head.matrix.scale(0.5, 0.4, 0.25);
  
  head.renderfast();
  
  var nose = new Cube();
  nose.color = [184/255, 122/255, 45/255, 1];
  if (g_normalOn) {
    nose.textureNum = -3;
  }
  nose.matrix.setTranslate(-0.07, 0.1, -0.06);
  nose.matrix.scale(0.12, 0.08, 0.1);
  
  nose.renderfast();

  var eyeL = new Cube();
  eyeL.color = [0, 0, 0, 1];
  if (g_normalOn) {
    eyeL.textureNum = -3;
  }
  eyeL.matrix.setTranslate(-0.185, 0.2, -0.025);
  eyeL.matrix.scale(0.07, 0.07, 0.05);
  
  eyeL.renderfast();

  var eyeR = new Cube();
  eyeR.color = [0, 0, 0, 1];
  if (g_normalOn) {
    eyeR.textureNum = -3;
  }
  eyeR.matrix.setTranslate(0.089, 0.2, -0.025);
  eyeR.matrix.scale(0.07, 0.07, 0.05);
 
  eyeR.renderfast();

  var eyeDotL = new Cube();
  eyeDotL.color = [1, 1, 1, 1];
  if (g_normalOn) {
    eyeDotL.textureNum = -3;
  }
  eyeDotL.matrix.setTranslate(-0.15, 0.24, -0.02511);
  eyeDotL.matrix.scale(0.02, 0.02, 0.03);
  
  eyeDotL.renderfast();

  var eyeDotR = new Cube();
  eyeDotR.color = [1, 1, 1, 1];
  if (g_normalOn) {
    eyeDotR.textureNum = -3;
  }
  eyeDotR.matrix.setTranslate(0.099, 0.24, -0.02511);
  eyeDotR.matrix.scale(0.02, 0.02, 0.03);
  
  eyeDotR.renderfast();

  var earL = new Cube();
  earL.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    earL.textureNum = -3;
  }
  earL.matrix.setTranslate(-0.28, 0.42, -0.001);
  earL.matrix.rotate(-90, 0, 0, 1);
  earL.matrix.scale(0.14, 0.14, 0.26);
  
  earL.renderT();

  // base of right ear
  var earR = new Cube();
  earR.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    earR.textureNum = -3;
  }
  earR.matrix.setTranslate(0.28, 0.42, -0.001);
  earR.matrix.rotate(180, 0, 0, 1);
  earR.matrix.scale(0.14, 0.14, 0.26);
  
  earR.renderT();

  // body
  var body = new Cube();
  body.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    body.textureNum = -3;
  }
  body.matrix.translate(-0.2, -0.4, -0.001);
  body.matrix.scale(0.4, 0.4, 0.25);
  
  body.matrix.rotate(0, 0, -2*g_idleBody, 1);  //idle animation
  
  body.renderfast();


  // these could be made into a cylinder
  // left upper parts of his body (the little bumps)
  var bodyL = new Cube();
  bodyL.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyL.textureNum = -3;
  }
  bodyL.matrix.translate(-0.25, 0.03, -0.04);
  bodyL.matrix.rotate(-70, 0, 0, 1);
  bodyL.matrix.scale(0.1, 0.1, 0.16);
 
  bodyL.renderfast();

  var bodyL2 = new Cube();
  bodyL2.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyL2.textureNum = -3;
  }
  bodyL2.matrix.translate(-0.27, 0.03, -0.04);
  bodyL2.matrix.rotate(-90, 0, 0, 1);
  bodyL2.matrix.scale(0.1, 0.1, 0.16);
  
  bodyL2.renderfast();

  var bodyL3 = new Cube();
  bodyL3.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyL3.textureNum = -3;
  }
  bodyL3.matrix.translate(-0.139, 0.039, -0.04);
  bodyL3.matrix.rotate(-105, 0, 0, 1);
  bodyL3.matrix.scale(0.1, 0.1, 0.16);
  
  bodyL3.renderfast();

  // right upper parts of his body
  var bodyR = new Cube();
  bodyR.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyR.textureNum = -3;
  }
  bodyR.matrix.translate(0.21, -0.067, -0.04);
  bodyR.matrix.rotate(70, 0, 0, 1);
  bodyR.matrix.scale(0.1, 0.1, 0.16);
  
  bodyR.renderfast();

  var bodyR2 = new Cube();
  bodyR2.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyR2.textureNum = -3;
  }
  bodyR2.matrix.translate(0.27, -0.07, -0.04);
  bodyR2.matrix.rotate(90, 0, 0, 1);
  bodyR2.matrix.scale(0.1, 0.1, 0.16);
  
  bodyR2.renderfast();

  var bodyR3 = new Cube();
  bodyR3.color = [135/255, 201/255, 197/255, 1];
  if (g_normalOn) {
    bodyR3.textureNum = -3;
  }
  bodyR3.matrix.translate(0.05, -0.087, -0.04);
  bodyR3.matrix.rotate(10, 0, 0, 1);
  bodyR3.matrix.scale(0.1, 0.1, 0.16);
  
  bodyR3.renderfast();

  // left arm and finger (connected)
  var armL = new Cylinder();
  if (g_normalOn) {
    armL.textureNum = -3;
  }
  armL.matrix.setTranslate(-0.2, -0.05, 0.05);
  
  armL.matrix.rotate(90, 100, -30, 1);
  armL.matrix.rotate(g_waveLAngle, 0, -g_waveLAngle, 1); // animation left arm on off
  armL.matrix.rotate(-g_leftArm, g_leftArm, g_leftArm, 1);  // arm slider

  var armLcoords = new Matrix4(armL.matrix);  // intermediate matrix
  armL.matrix.scale(0.1, 0.1, 0.07);
  
  armL.render();

  // left finger
  var fingerL = new Cone();
  fingerL.color = [1, 1, 1, 1];
  if (g_normalOn) {
    fingerL.textureNum = -3;
  }
  fingerL.matrix = armLcoords;
  fingerL.matrix.translate(0.0, 0.0, 0.135); // left right, back front, up down
  
  fingerL.matrix.rotate(g_leftHand, -g_leftHand, -g_leftHand, 1);  // slider move
  //fingerL.matrix.rotate(0, 0, 0, 1);
  fingerL.matrix.scale(0.1, 0.1, 0.1);
  //fingerL.matrix.rotate(-g_leftArm, g_leftArm, g_leftArm, 1);
  
  fingerL.render();


  // right arm and finger (coonected)
  var armR = new Cylinder();
  if (g_normalOn) {
    armR.textureNum = -3;
  }
  armR.matrix.setTranslate(0.2, -0.05, 0.05);
  armR.matrix.rotate(90, 100, 30, 1);
  armR.matrix.rotate(g_waveRAngle, 0, g_waveRAngle, 1);
  armR.matrix.rotate(g_rightArm, -g_rightArm, g_rightArm, 1); // slider arm

  var armRcoords = new Matrix4(armR.matrix);
  armR.matrix.scale(0.1, 0.1, 0.07);
  
  armR.render();

  var fingerR = new Cone();
  fingerR.color = [1, 1, 1,1];
  if (g_normalOn) {
    fingerR.textureNum = -3;
  }
  fingerR.matrix = armRcoords;
  fingerR.matrix.translate(0.0, 0.0, 0.135);
  //fingerR.matrix.rotate(90, 190, 140, 1);
  fingerR.matrix.rotate(g_rightHand, -g_rightHand, g_rightHand, 1);
  fingerR.matrix.scale(0.1, 0.1, 0.1);
  
  fingerR.render();


  // feet
  var footL = new Cube();
  footL.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    footL.textureNum = -3;
  }
  footL.textureNum = -1;
  footL.matrix.setTranslate(-0.245, -0.45, -0.1);
  footL.matrix.rotate(-20, 0, 20, 1);
  footL.matrix.rotate(1, -4*g_idleFeet, -4*g_idleFeet, 1);  // idle animation
  footL.matrix.scale(0.2, 0.08, 0.15);
  
  footL.renderfast();

  // uhh smth is wrong with the right foot i wanna push it back ;-;
  var footR = new Cube();
  footR.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    footR.textureNum = -3;
  }
  footR.textureNum = -1;
  footR.matrix.translate(0.07, -0.45, -0.05);
  footR.matrix.rotate(-30, 0, -20, 1);
  footR.matrix.rotate(1, -4*g_idleFeet, -4*g_idleFeet, 1);  // idle animation
  footR.matrix.scale(0.2, 0.08, 0.15);
  
  footR.renderfast();

  var tail = new Cube();
  tail.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    tail.textureNum = -3;
  }
  tail.matrix.translate(-0.1, -0.38, 0.35);
  tail.matrix.scale(0.2, 0.1, 0.3);
  tail.matrix.rotate(-10, 45, 0, 1);
  tail.matrix.rotate(-2.5*g_tailAngle, 5*g_tailAngle, 0, 1);  // animate tail to move
  
  tail.renderfast();

  // extension for the tail to wiggle more less weirdly
  var butt = new Cube();
  butt.color = [57/255, 88/255, 132/255, 1];
  if (g_normalOn) {
    butt.textureNum = -3;
  }
  butt.matrix.translate(-0.105, -0.38, 0.255);
  butt.matrix.scale(0.21, 0.1, 0.1);
  
  butt.renderfast();

  // eyebrows and mouth? for angry poke animation?
  var mouthL = new Cube();
  mouthL.color = [0, 0, 0, 1];
  if (g_normalOn) {
    mouthL.textureNum = -3;
  }
  mouthL.matrix.setTranslate(-0.09, 0.025, -0.005);
  mouthL.matrix.rotate(30, 0, 0, 1);
  mouthL.matrix.scale(0.1, 0.01, 0.01);
  
  mouthL.renderfast();

  var mouthR = new Cube();
  mouthR.color = [0, 0, 0, 1];
  if (g_normalOn) {
    mouthR.textureNum = -3;
  }
  mouthR.matrix.setTranslate(-0.008, 0.07, -0.005);
  mouthR.matrix.rotate(-30, 0, 0, 1);
  mouthR.matrix.scale(0.1, 0.01, 0.01);
  
  mouthR.renderfast();

  // var browL = new Cube();
  // var browR = new Cube();

  // osha shell!
  var shellTop = new Cone();
  shellTop.color = [255/255, 251/255, 185/255, 1];
  if (g_normalOn) {
    shellTop.textureNum = -3;
  }

  shellTop.matrix.setTranslate(0, -0.16, -0.002);
  //shellTop.matrix.rotate(-180, -180, -180, 1);
  //shellTop.matrix.rotate(90, 90, 180, 1);
  shellTop.matrix.rotate(90, 100, 0, 1);

  //var shellCoord = new Matrix4(shellTop.matrix);
  //shellTop.matrix.rotate(0, 0, 90, 1);
  shellTop.matrix.rotate(0, 0, -2*g_idleBody, 1);  //idle animation
  shellTop.matrix.scale(0.2, 0.2, 0.1);
  
  shellTop.render();


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