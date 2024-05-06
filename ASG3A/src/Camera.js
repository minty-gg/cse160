class Camera {
    constructor() {
        // this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        // this.color = [1.0, 1.0, 1.0, 1.0];
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    forward() {
        var f = this.at.sub(this.eye);
        f = f.div(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    back() {
        var f = this.eye.sub(this.at);
        f = f.divide(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left() {
        var f = this.at.sub(this.eye);
        f = f.divide(f.length());

        var s = f.cross(this.up);
        s = s.divide(s.length());

        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    right() {
        var f = this.at.sub(this.eye);
        f = f.divide(f.length());

        var s = -f.cross(this.up);
        s = s.divide(s.length());

        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
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
