// CSE 160 Spring 2024

// drawVector()
// Function that draws the line of a vector with the provided color
 function drawVector(v, color) {

    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // source: https://www.javatpoint.com/how-to-draw-a-line-using-javascript#:~:text=ct_var.strokeStyle%C2%A0%3D%C2%A0%27yellow%27%3B%C2%A0%C2%A0
    ctx.beginPath();

    // prob better to use (canvas.width / 2) and (canvas.height / 2) for a more conventional way oops
    ctx.moveTo(200, 200);
    ctx.lineTo(200 + (v.elements[0]*20), 200 - (v.elements[1]*20));

    // sets the color of the line to red/whatever color parameter holds
    ctx.strokeStyle = color;
    ctx.stroke();
 }

 // handleDrawEvent()
 // Function that handles the drawing of the inputted vector coordinates 
 // when the draw button is clicked.
 function handleDrawEvent() {
    // Clear the canvas.
    // Read the values of the text boxes to create v1.
    // Call drawVector(v1, "red") .
    
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // source: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing 
    // source: https://stackoverflow.com/questions/11563638/how-do-i-get-the-value-of-text-input-field-using-javascript#:~:text=document.getElementById(%27textbox_id%27).value%20to%20get%20the%20value%20of%20desired%20box 
    
    ctx.clearRect(0, 0, 400, 400);

    // retrieve v1 coordinates
    var x1 = document.getElementById('xcoord1').value;
    var y1 = document.getElementById('ycoord1').value;

    // retrieve v2 coordinates
    var x2 = document.getElementById('xcoord2').value;
    var y2 = document.getElementById('ycoord2').value;

    if (!x1) {
        console.log("Failed to retrieve v1's x-coordinate");
    }
    if (!y1) {
        console.log("Failed to retrieve v1's y-coordinate");
    }
    if (!x2) {
        console.log("Failed to retrieve v2's x-coordinate");
    }
    if (!y2) {
        console.log("Failed to retrieve v2's y-coordinate");
    }

    var v1 = new Vector3([x1, y1, 0]);
    var v2 = new Vector3([x2, y2, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");
 }

// angleBetween(v1, v2)
// Function that finds the angle between 2 vectors with the definition of a dot product
// def of dot product: a * b =  ||a|| * ||b|| * cos(alpha) --> to find angle
function angleBetween(v1, v2) {
    var alpha = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())); // NOTE: this is in radians, convert to degree
    var angle = alpha * (180 / Math.PI);  // 1 radian = 180 deg / pi
    console.log("Angle: " + angle);
}

// areaTriangle(v1, v2)
// Function that finds the area of the triangle forms by two vectors
// uses the cross product definition: ||a x b|| = ||a|| * ||b|| * sin(alpha) = area of the parallelogram the vector spans
function areaTriangle(v1, v2) {
    var cross = Vector3.cross(v1, v2);  // v1 x v2
    var area = 0.5 * (cross.magnitude());  // area of triangle = magnitude of area of parallelogram / 2
    // var angle = 0;
    // var area = 0;
    console.log("Area: " + area);
}

 // handleDrawOperationEvent()
 // Function that draws new vectors (v3, or v1 and v2) in green 
 // depending on which operation/scalars were used.
function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    ctx.clearRect(0, 0, 400, 400);

    // draws vectors v1 and v2
    handleDrawEvent();

    // read them again
    // retrieve v1 coordinates
    var x1 = document.getElementById('xcoord1').value;
    var y1 = document.getElementById('ycoord1').value;

    // retrieve v2 coordinates
    var x2 = document.getElementById('xcoord2').value;
    var y2 = document.getElementById('ycoord2').value;

    if (!x1) {
        console.log("Failed to retrieve v1's x-coordinate");
    }
    if (!y1) {
        console.log("Failed to retrieve v1's y-coordinate");
    }
    if (!x2) {
        console.log("Failed to retrieve v2's x-coordinate");
    }
    if (!y2) {
        console.log("Failed to retrieve v2's y-coordinate");
    }

    var v1 = new Vector3([x1, y1, 0]);  
    var v2 = new Vector3([x2, y2, 0]); 
    var v3 = new Vector3();
    var v4 = new Vector3();
    // v3.set(v1);  // v3 copied as v1
    // v4.set(v2);  // v4 copied as v2

    // retrieve the operations option and scalar value
    // source: https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
    // source: https://www.quora.com/How-do-I-pass-the-selected-value-of-a-dropdown-in-JavaScript
    var dropdown = document.getElementById("option-select");
    var selected_value = dropdown.value;
    var s = document.getElementById("scalar-val").value;

    if (selected_value == "add") {
        v3 = v1.add(v2);  // v3 = v1 + v2
    }
    if (selected_value == "sub") {
        v3 = v1.sub(v2)    // v3 = v1 - v2
    }
    if (selected_value == "mul") {
        v3 = v1.mul(s);
        v4 = v2.mul(s);
    }
    if (selected_value == "div") {
        v3 = v1.div(s);
        v4 = v2.div(s);
    }

    if (selected_value == "angle") {
        angleBetween(v1, v2);
    }

    if (selected_value == "area") {
        areaTriangle(v1, v2);
    }

    if (selected_value == "mag") {
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    }
    if (selected_value == "norm") {
        v3 = v1.normalize();
        v4 = v2.normalize();
    }
    drawVector(v3, "green");
    drawVector(v4, "green");
}



 // DrawRectangle.js
 // Function to draw a vector on the canvas
 function main() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    canvas.style.backgroundColor = "black";
    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');

    // Part 1:
    // Draw a blue rectangle <- (3)
    //ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
    //ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color

    // Part 2:
    // Draw a red vector v1 on a black canvas instead of the blue rectangle.

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    var v1 = new Vector3([2.25, 2.25, 0]);
    drawVector(v1, "red");

    // debugging test case 9:
    // var test = new Vector3([-87, 22, 66.45623]);
    // console.log("test: " + [test.elements[0], test.elements[1], test.elements[2]]);
    // test.normalize();
    // console.log("normalize [-87, 22, 66.45623]: " + [test.elements[0], test.elements[1], test.elements[2]]);
}