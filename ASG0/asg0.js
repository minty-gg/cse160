

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

    var x = document.getElementById('xcoord').value;
    var y = document.getElementById('ycoord').value;

    if (!x) {
        console.log("Failed to retrieve vector's x-coordinate");
    }
    if (!y) {
        console.log("Failed to retrieve vector's y-coordinate");
    }

    var v1 = new Vector3([x, y, 0]);
    drawVector(v1, "red");
    


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

    // Part 3:
    // if button is clicked: calls handleDrawEvent() --> done in the HTML file
    
    // Part 4:
    // 

}