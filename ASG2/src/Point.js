// create a class called Point to store all the variables we'll be using
class Point{

    // Constructor
    constructor(){
      this.type='point';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    // Render this shape
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
      // Quit using the buffer ti send the attribute
      gl.disableVertexAttribArray(a_Position);

      // Pass the position of a point to a_Position variable
      // it's only taking the last thing that was on the buffer (aka last triangle) 
      // so everytime we draw triangles the points disappear
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // Pass the size of a point to u_Size variable
      gl.uniform1f(u_Size, size);
  
      // Draw
      // drawTriangle( [xy[0], xy[1], xy[0]+.1, xy[1], xy[0], xy[1]+.1] );
      gl.drawArrays(gl.POINTS, 0, 1);  // draws all points?
    }
  }