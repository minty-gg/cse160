class Camera {

    // oshawott's camera POV: 
    // eye = [0, 0, -3]
    // at = [0, 0, 100]
    // up = [0, 1, 0]


    constructor() {
        // this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        // this.color = [1.0, 1.0, 1.0, 1.0];

        // starting position: at the entrance of the maze
        this.eye = new Vector3([-4, 0, -8]);      // starting point for where 3D space is viewed
        this.at = new Vector3([0, 0, 100]);    // look at point at which you are looking at from the eye point
        this.up = new Vector3([0, 1, 0]);       // up direction in which the scene is viewed from. rotating head from eye point to match look at point
        
    }


    forward() {
        // ==  asgn doc way  ==
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.2);
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    back() {
        // == asgn doc way ==
        var f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(0.2);
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left() {

        // == asgn doc way ==

        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var s = Vector3.cross(this.up, f);
        s.normalize();
        
        s.mul(0.2);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);

    }

    right() {
        // == asgn doc way ==
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var s = Vector3.cross(f, this.up);
        s.normalize();
        
        s.mul(0.2);
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    // SOURCE for Q and E pan rotations: https://people.ucsc.edu/~jbrowne2/asgn3/World.html 

    // Q
    panLeft(){

        var atp = new Vector3();
        atp.set(this.at.sub(this.eye));

        var r = Math.sqrt(atp.elements[0] * atp.elements[0]  +  atp.elements[2] * atp.elements[2]);
        var theta = Math.atan2(atp.elements[2], atp.elements[0]);

        theta = theta - 5*(Math.PI/180);
        atp.elements[0] = r * Math.cos(theta);
        atp.elements[2] = r * Math.sin(theta);

        this.at.set(atp);
        this.at.add(this.eye);

    }

    // E
    panRight() {
        // let rotationMatrix = new Matrix4();

        // var f = new Vector3();
        // f.set(this.at);
        // f.sub(this.eye);

        // var alpha = -1;
        // rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        // var f_prime = rotationMatrix.multiplyVector3(f);
        // this.at = this.eye.add(f_prime);

        var atp = new Vector3();
        atp.set(this.at.sub(this.eye));

        var r = Math.sqrt(atp.elements[0] * atp.elements[0]  +  atp.elements[2] * atp.elements[2]);
        var theta = Math.atan2(atp.elements[2], atp.elements[0]);

        theta = theta + 5*(Math.PI/180);
        atp.elements[0] = r * Math.cos(theta);
        atp.elements[2] = r * Math.sin(theta);

        this.at.set(atp);
        this.at.add(this.eye);

    }

    // Z
    panUp() {
        g_camera.at.elements[1] += 5; 
    }

    // X
    panDown() {
        g_camera.at.elements[1] -= 5; 
    }
}

// ==TO MOVE FORWARD:==
// ==if one unit step forward:==
// d.normalize();
// eye = eye + d; // steps one unit forward along the new eye position 
// at = at + d

// ==TO MOVE LEFT: use cross product==
// d = at - eyes  // up vector
// left = d x up; // d.cross(up)?

// ==TO MOVE RIGHT: opposite of left==
// d = at - eyes
// right = - d x up

// ===========
// atp = at - eyes; //the at point in the eye coordinate system
// r = sqrt( (d.x)^2 + (d.y)^2 )
// theta = arctan(d.y, d.x)
// ===========

// == TO ROTATE IT: ==
// theta = theta + 5 deg (might need to convert to radians)

// == NEW DIRECTION VECTOR: (to reset direction vector)==
// new_x = r * cos(theta)
// new_y = r * sin(theta)
// d = (new_x, new_y);
// new_AT = eye + d;
