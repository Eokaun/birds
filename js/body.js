// Rect avec des capacités physiques

class Body extends Rect
{
    constructor (v, w, h, m, hp)
    {
        super(v, w, h);
        this.mass = m || 0;
        this.invMass = 1 / Math.max(this.mass, 1);
        this.velocity = Vector.ZERO;
        this.force = Vector.ZERO;
        this.hasCollision = false;
        
        // Ticks restant avant disparition
        this.lifetime = Infinity

        // PDV
        this.originalHp = hp;

        // PDV restant
        this.hp = hp;
    }

    setCollision (b) {
        this.hasCollision = b;
    }

    onCollision () {
        // Implémentable par extension
    }

    /**
     * Détection de collision entre l'objet courrant et l'objet b.
     * Renvoie null si pas de collision, sinon renvoie les nouveau vecteur vitesses pour l'objet courant et pour b
     * @param b
     * @returns {null|{velocity2: Vector, velocity1}}
     */
    collision (b)
    {
        let mdiff = this.minkowski(b);

        if (mdiff.hasOrigin())
        {
            let vectors = [ new Vector (0,mdiff.origin.y),
                new Vector (0,mdiff.origin.y+mdiff.height),
                new Vector (mdiff.origin.x, 0),
                new Vector (mdiff.origin.x + mdiff.width, 0) ];

            let n = vectors[0];

            for (let i = 1; i < vectors.length; i++) {
                if (vectors[i].norm() < n.norm())
                    n = vectors[i];
            }

            let norm_v = this.velocity.norm();
            let norm_vb = b.velocity.norm();
            let kv = norm_v / (norm_v + norm_vb);
            let kvb = norm_vb / (norm_v + norm_vb);

            if (norm_v == 0 && norm_vb == 0) {
                if (this.invMass == 0 && b.invMass == 0)
                    return null;
                else {
                    if (this.mass <= b.mass)
                        kv = 1;
                    else
                        kvb = 1
                }
            }

            this.move(n.mult(kv));
            b.move(n.mult(-kvb));

            n = n.normalize();

            // Calcul de l'impulsion j
            let v = this.velocity.sub(b.velocity);
            let e = Constants.elasticity;
            let j = -(1 + e) * v.dot(n) / (this.invMass + b.invMass);

            // Calcul de la nouvelle vitesse
            let new_v = this.velocity.add(n.mult(j  * this.invMass));
            let new_bv = b.velocity.sub(n.mult(j * b.invMass));

            // Indicateurs de collision
            b.setCollision(true);
            this.setCollision(true);

            // Events
            this.onCollision(b)
            b.onCollision(this)

            return { velocity1 : new_v, velocity2 : new_bv };
        }
        
        return null;
    }
}