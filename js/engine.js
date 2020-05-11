class Engine
{
    constructor () {
        this.bodies = [];
    }

    addBody (b) {
        this.bodies.push(b);
    }

    removeBody (b) {
        let i = this.bodies.findIndex (function (e) {
            return e == b;
        });

        if (i >= 0)
            this.bodies.splice(i, 1);
    }

    update (dt)
    {
        for (let i = 0; i < this.bodies.length; i ++) {
            let body = this.bodies[i];

            // Vérification des collisions avec les autres objets
            for (let j = i + 1; j < this.bodies.length; j++)
            {
                let otherBody = this.bodies[j];
                let res = body.collision(otherBody);

                if (res != null) {
                    // En cas de collision, on change la vélocité
                    body.velocity = res.velocity1;
                    otherBody.velocity = res.velocity2;
                }
            }

            if (Number.isFinite(body.mass))
                body.force = body.force.add(Constants.gravity.mult(body.mass));

            // Calcul de la nouvelle accélération
            let a = body.force.mult(body.invMass);
            body.force = Vector.ZERO;
            
            let delta_v = a.mult(dt);
            body.velocity = body.velocity.add(delta_v);

            // Mise à jour de la position de l'objet
            body.move(body.velocity.mult(dt));

            // On décrémente le temps d'affichage restant
            if (Number.isFinite(body.lifetime))
                body.lifetime--;

            // En cas de temps d'affichage nul, on supprime l'objet
            if (body.lifetime <= 0)
                this.removeBody(body)
        }
    }
}