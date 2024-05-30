class Sphere{
    constructor(){
        this.type='sphere';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -2; 
        this.verts32 = new Float32Array([]); 
        //this.g_BlocksInWorld = [];  
        // -2 goes back to original cube colors, -1 sets to debugging colors, 0 sets to the specified texture
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the texure number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = Math.PI /10;   // used to be 10 // the step size to go from point to point   
        var dd = Math.PI / 10; // 10 for complete sphere // the little delta
        // r is row in this case?
        // t is ... ?
        // p1 p2 p3 make a triangle

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2*Math.PI); r += d) {
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                
                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];
                
                var uv1 = [t/Math.PI, r/(2*Math.PI)];
                var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
                var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
                var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

                // make first triangle
                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);    // uv's are all 0 rn
                v = v.concat(p2); uv = uv.concat(uv2);
                v = v.concat(p4); uv = uv.concat(uv4);

                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                drawTriangle3DUVNormal(v, uv, v);   // only in sphere, the position is also the normal
                
                // make second triangle?
                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p4); uv = uv.concat(uv4);
                v = v.concat(p3); uv = uv.concat(uv3);
                
                gl.uniform4f(u_FragColor, 1, 0, 0, 1);
                drawTriangle3DUVNormal(v, uv, v);
            }   
            
        }   
    }
}