class Triangle{
    constructor(){
        this.type='triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
    
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, size);
    
        // Draw
        var d = this.size/200.0; // delta for the size
        drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d] );
        //gl.drawArrays(gl.POINTS, 0, 1);  // draws all points?
    }
}


// changed this function so that we can just draw the triangle with given vertices straight from cpu to gpu
function drawTriangle(vertices) {//initVertexBuffers(gl) {

    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer(); // making a buffer on the GPU
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // this is on the GPU taken from the CPU (vertices)
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // last two 0's = offset and stride (only if you use interleaved? but prof does not recc so set to 0)
    // the param 2: means we have 2 elements per vertice (x and y coord)
  
    // Enable the assignment to a_Position variable
    // this turns back the triangles on after the Point.js disables this to draw points
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
  }
  

  // draw Triangles in 3D
  function drawTriangle3D(vertices) {//initVertexBuffers(gl) {

    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer(); // making a buffer on the GPU
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // this is on the GPU taken from the CPU (vertices)
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // last two 0's = offset and stride (only if you use interleaved? but prof does not recc so set to 0)
    // the param 2: means we have 2 elements per vertice (x and y coord)
  
    // Enable the assignment to a_Position variable
    // this turns back the triangles on after the Point.js disables this to draw points
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
  }


  function drawTriangle3DUV(vertices, uv) {

    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer(); // making a buffer on the GPU
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // last two 0's = offset and stride (only if you use interleaved? but prof does not recc so set to 0)
    // the param 2: means we have 2 elements per vertice (x and y coord)
  
    // Enable the assignment to a_Position variable
    // this turns back the triangles on after the Point.js disables this to draw points
    gl.enableVertexAttribArray(a_Position);



    // Create a buffer object for UV
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the buffer object');
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_UV variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // ENable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
  
  }
  