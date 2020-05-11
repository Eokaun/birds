// Réprésentation d'un rectangle avec origine vectorielle

class Rect
{
    constructor (v, w, h) {
        this.origin = v;
        Object.defineProperty( this, "width", { writable: false, value : w });
        Object.defineProperty( this, "height", { writable: false, value : h });
    }

    move (v) {
        this.origin = this.origin.add(v);
    }

    // Somme de Minkowski
    minkowski (r) {
        let origin = new Vector(
            r.origin.x - this.origin.x - this.width,
            r.origin.y - this.origin.y - this.height
        );

        return new Rect(origin, this.width + r.width, this.height + r.height);
    }

    hasOrigin () {
        return (this.origin.x < 0 && this.origin.x + this.width > 0)
            && (this.origin.y < 0 && this.origin.y + this.height > 0);
    }
}