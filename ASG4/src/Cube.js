class Cube{
    constructor(){
        this.type='cube';
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = -2;  
        //this.g_BlocksInWorld = [];  
        // -2 goes back to original cube colors, -1 sets to debugging colors, 0 sets to the specified texture
        this.normalVerts = [

            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,

            0,1,0,  0,1,0,  0,1,0,
            0,1,0, 0,1,0,  0,1,0,

            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0,

            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,

            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,

            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1

        ];
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

        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        // Drawing with 3DUV Normal
        
        // Front of Cube
        drawTriangle3DUVNormal(
            [0,0,0,   1,1,0,   1,0,0],  // position for the vertices of triangle
            [0,0,   1,1,   1,0],        // UV of triangle
            [0,0,-1, 0,0,-1, 0,0,-1]    // normal for the vertices of triangle
        );
        drawTriangle3DUVNormal([0,0,0,  0,1,0,  1,1,0], [0,0,  0,1,  1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

        //gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);

        // Top of Cube 
        drawTriangle3DUVNormal([0,1,0,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,1,0, 0,1,0, 0,1,0]);
        drawTriangle3DUVNormal([0,1,0,  1,1,1,  1,1,0], [0,0,  1,1,  1,0], [0,1,0, 0,1,0, 0,1,0]);

        //gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);

        // Right of Cube
        drawTriangle3DUVNormal([1,1,0,  1,1,1,  1,0,0], [0,0,  0,1,  1,1], [1,0,0, 1,0,0, 1,0,0]);
        drawTriangle3DUVNormal([1,0,0,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [1,0,0, 1,0,0, 1,0,0]);

        //gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        // Left of Cube
        drawTriangle3DUVNormal([0,1,0,  0,1,1,  0,0,0], [0,0,  0,1,  1,1], [-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal([0,0,0,  0,1,1,  0,0,1], [0,0,  1,1,  1,0], [-1,0,0, -1,0,0, -1,0,0]);

        //gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
        
        // Bottom of Cube
        drawTriangle3DUVNormal([0,0,0,  0,0,1,  1,0,1], [0,0,  0,1,  1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal([0,0,0,  1,0,1,  1,0,0], [0,0,  1,1,  1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

        //gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        // Back of Cube
        drawTriangle3DUVNormal([0,0,1,  1,1,1,  1,0,1], [0,0,  0,1,  1,1], [0,0,1, 0,0,1, 0,0,1]);
        drawTriangle3DUVNormal([0,0,1,  0,1,1,  1,1,1], [0,0,  1,1,  1,0], [0,0,1, 0,0,1, 0,0,1]);

        // ====
        

        // === OLD ====
        // // Front of cube
        // //drawTriangle3D( [ 0.0, 0.0, 0.0,   1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ] );
        // drawTriangle3D( [ 0.0, 0.0, 0.0,   1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );   // pink one
        // drawTriangle3D( [ 0.0, 0.0, 0.0,   0.0, 1.0, 0.0,  1.0, 1.0, 0.0 ], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );   // second one ( mostly blue)
        
        // // Back face of cube
        // drawTriangle3D( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        // drawTriangle3D( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );

        // // Pass the color of a point to u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        // // Top of cube
        // drawTriangle3D( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        // drawTriangle3D( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );

        // // Other sides of cube top, bottom, left, right, back <fill this in yourself>

        // // Left face of cube
        // drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        // drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );

        // // Right face of cube
        // drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        // drawTriangle3D( [1.0, 1.0, 1.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );

        
        // gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // // Bottom of cube
        // drawTriangle3D( [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        // drawTriangle3D( [1.0, 0.0, 1.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        // what if i change them all to drawTriangle3D..
    }

    renderfast() {
        var rgba = this.color;
        //var size = this.size;

        // Pass the texure number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        var allverts = [];
        var allUVs = [];

        // Front of cube
        //drawTriangle3DUV( [ 0.0, 0.0, 0.0,   1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );   // pink one
        //drawTriangle3DUV( [ 0.0, 0.0, 0.0,   0.0, 1.0, 0.0,  1.0, 1.0, 0.0 ], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );   // second one ( mostly blue)
        allverts = allverts.concat( [ 0.0, 0.0, 0.0,   1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ] );
        allverts = allverts.concat( [ 0.0, 0.0, 0.0,   0.0, 1.0, 0.0,  1.0, 1.0, 0.0 ] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);

        // Back face of cube
        //drawTriangle3DUV( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        //drawTriangle3DUV( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        allverts = allverts.concat( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0] );
        allverts = allverts.concat( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);

        // Pass the color of a point to u_FragColor uniform variable
        //gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        // Top of cube
        //drawTriangle3DUV( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        //drawTriangle3DUV( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        allverts = allverts.concat( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0] );
        allverts = allverts.concat( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);

        // Other sides of cube top, bottom, left, right, back <fill this in yourself>

        // Left face of cube
        //drawTriangle3DUV( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        //drawTriangle3DUV( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        allverts = allverts.concat( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0] );
        allverts = allverts.concat( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);

        // Right face of cube
        //drawTriangle3DUV( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        //drawTriangle3DUV( [1.0, 1.0, 1.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        allverts = allverts.concat( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0] );
        allverts = allverts.concat( [1.0, 1.0, 1.0,   1.0, 1.0, 0.0,   1.0, 0.0, 1.0] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);

        
        //gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // Bottom of cube
        //drawTriangle3DUV( [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0], [1.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        //drawTriangle3DUV( [1.0, 0.0, 1.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0], [0.0, 0.0,  0.0, 1.0,  1.0, 1.0] );
        allverts = allverts.concat( [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0] );
        allverts = allverts.concat( [1.0, 0.0, 1.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0] );
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        allUVs = allUVs.concat([0.0, 0.0,  0.0, 1.0,  1.0, 1.0]);
        
        //drawTriangle3D(allverts);
        //this.g_BlocksInWorld = allverts; //g_BlocksInWorld.concat(allverts);
        drawTriangle3DUVNormal(allverts, allUVs, this.normalVerts);

    }

    // 3d triangle, change these to 3D UV too!! ? 
    renderT() {
        var rgba = this.color;
        //var size = this.size;

        // Pass the texure number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        
        // front
        drawTriangle3D( [1.0, 0.0, 0.0,   0.0, 1.0, 0.0,    0.0, 0.0, 0.0]);
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([1.0, 0.0, 0.0,   0.0, 1.0, 0.0,    0.0, 0.0, 0.0]);

        // back
        drawTriangle3D( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,    0.0, 0.0, 1.0] );
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([1.0, 0.0, 1.0,   0.0, 1.0, 1.0,    0.0, 0.0, 1.0]);

        // Pass the color of a point to u_FragColor uniform variable 
        // (make the bottom ones a diff shade, shows texture)
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        
        // Left face of cube
        drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0] );
        // this.g_BlocksInWorld = this.g_BlocksInWorld.concat([0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0]);
        // this.g_BlocksInWorld = this.g_BlocksInWorld.concat([0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.85, rgba[1] * 0.85, rgba[2] * 0.85, rgba[3]);
        // right slant
        drawTriangle3D( [1.0, 0.0, 0.0,    0.0, 1.0, 0.0,   1.0, 0.0, 1.0] );
        drawTriangle3D( [0.0, 1.0, 0.0,    0.0, 1.0, 1.0,   1.0, 0.0, 1.0] );
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([1.0, 0.0, 0.0,    0.0, 1.0, 0.0,   1.0, 0.0, 1.0]);
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([0.0, 1.0, 0.0,    0.0, 1.0, 1.0,   1.0, 0.0, 1.0]);

        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // Bottom of cube
        drawTriangle3D( [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 1.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0] );
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0]);
        //this.g_BlocksInWorld = this.g_BlocksInWorld.concat([1.0, 0.0, 1.0,   1.0, 0.0, 0.0,   0.0, 0.0, 1.0]);
    }
}