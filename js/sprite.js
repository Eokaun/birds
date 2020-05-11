// Images de sprite chargées via le DOM
const Images = {
    bullet1: document.getElementById('bullet1'),
    bullet2: document.getElementById('bullet2'),
    enemy1: document.getElementById('enemy1'),
    enemy2: document.getElementById('enemy2'),
    box: document.getElementById('box'),
    wood: document.getElementById('wood'),
    slingshot: document.getElementById('slingshot'),
};

class Sprite extends Body
{
    constructor (v, w, h, m, type, hp)
    {
        super(v, w, h, m, hp);
        this.type = type;
    }

    draw (canvas, context)
    {
        if (this.type === 'wall') {
            if (this.hasCollision) {
                this.setCollision(false);
            }
        }
        else {
            let image = Images[this.type]
            context.globalAlpha = Number.isFinite(this.lifetime) ? 0.5 : 1;
            context.drawImage(image, this.origin.x, this.origin.y, this.width, this.height);

            if (this.originalHp - this.hp > 0) {
                context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                context.fillRect(this.origin.x, this.origin.y, this.width, this.height);
            }
        }
    }

    isBullet() {
        return this.type === 'bullet1' || this.type === 'bullet2'
    }

    isEnemy() {
        return this.type === 'enemy1' || this.type === 'enemy2'
    }

    isBreakable() {
        return this.type === 'box' || this.type === 'wood'
    }

    onCollision (against)
    {
        // Les projectiles doivent disparaitre après avoir touché un premier objet
        if (this.isBullet() && against.type !== 'wall' && against.type !== 'slingshot') {
            if (!Number.isFinite(this.lifetime))  {
                this.lifetime = 20
            }
        }

        // Les ennemis doivent perdre 1 PDV lorsqu'ils sont touchés par un projectile
        if (this.isBullet() && against.isEnemy()) {
            if (!Number.isFinite(against.lifetime)) {
                against.hp--;
                if (against.hp === 0)
                    against.lifetime = 10
            }
        }

        // Les objets cassables doivent perdre 1 PDV lorsqu'ils sont touchés par un projectile
        if (this.isBullet() && against.isBreakable()) {
            if (!Number.isFinite(against.lifetime)) {
                against.hp--;
                if (against.hp === 0)
                    against.lifetime = 30
            }
        }
    }
}