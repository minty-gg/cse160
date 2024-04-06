
 // DrawRectangle.js
 // Function to draw a vector on the canvas

 function drawVector(v, color){

    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    var ctx = canvas.getContext('2d');

    // source: https://www.javatpoint.com/how-to-draw-a-line-using-javascript#:~:text=ct_var.strokeStyle%C2%A0%3D%C2%A0%27yellow%27%3B%C2%A0%C2%A0
    ctx.beginPath();
    ctx.moveTo(200,200);
    ctx.lineTo(200 + (v.elements[0]*20), 200 - (v.elements[1]*20));

    // sets the color of the line to red/whatever color parameter holds
    ctx.strokeStyle = color;
    ctx.stroke();
 }

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

    // Part 1
    // Draw a blue rectangle <- (3)
    //ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
    //ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color

    // Part 2
    // Draw a red vector v1 on a black canvas instead of the blue rectangle.

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    var v1 = new Vector3([2.25, 2.25, 0]);
    drawVector(v1, "red");

}