// Tiffany Guan
// CruzID: tijguan
// ID: #1882244
// CSE 160 Asg0
// Spring 2024


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
    ctx.moveTo(200,200);
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

    // zzzzz
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

    // Part 3 and Part 4: ( done in .html file and handleDrawEvent() function)
    // if button is clicked: calls handleDrawEvent() --> done in the HTML file
    
    // Part 5:
    // 

}