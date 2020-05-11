class Vector
{
    constructor (x, y) {
        Object.defineProperty( this, "x", { writable: false, value : x });
        Object.defineProperty( this, "y", { writable: false, value : y });
    }

    add (v) { // Transformer
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) { // Transformer
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(k) { // Transformer
        return new Vector(this.x * k, this.y * k);
    }

    dot(v) { // Scalar
        return this.x * v.x + this.y * v.y;
    }

    norm() { // ||v||
        return Math.sqrt(this.dot(this));
    }

    normalize() { // Vecteur dans la même direction, mais de longueur 1
        return this.mult(1 / this.norm());
    }
}

Vector.ZERO = new Vector(0,0);
Vector.UNIT_X = new Vector(1,0);
Vector.UNIT_Y = new Vector(0,1);
Vector.MINUS_UNIT_X = new Vector(-1, 0);
Vector.MINUS_UNIT_Y = new Vector(0, -1);