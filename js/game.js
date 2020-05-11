class Game
{
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 600;

        this.engine = new Engine();
        this.renderer = new Renderer(this.engine, this.canvas);

        // Projectile
        this.bullet = null

        // Date de début de pression de la barre d'espace
        this.startedLaunchAt = null

        // JSON du niveau
        this.level = null
    }

    // Chargement d'un niveau via JSON
    load(level)
    {
        let game = this

        fetch('js/levels/' + level + '.json')
            .then(function(response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                game.level = jsonResponse
                game.init()
            });
    }

    // Initialisation du niveau chargé
    init()
    {
        let game = this;

        this.engine.addBody( // Paroi du haut
            new Sprite(new Vector(0,0), 1000, 20, Infinity, 'wall', Infinity)
        );

        this.engine.addBody( // Paroi du bas
            new Sprite(new Vector(0, this.level.ground.level), 1000, 20, Infinity, 'wall', Infinity)
        );

        this.engine.addBody( // Paroi de gauche
            new Sprite(new Vector(0,20), 1, 515, Infinity, 'wall', Infinity)
        );

        this.engine.addBody( // Paroi de droite
            new Sprite(new Vector(999,20), 1, 515, Infinity, 'wall', Infinity)
        );

        // Ajout des objets du niveau
        this.level.bodies.map((bodyData) => {
            let body = new Sprite(
                new Vector(bodyData.position.x, bodyData.position.y),
                bodyData.size.width,
                bodyData.size.height,
                bodyData.mass,
                bodyData.type,
                bodyData.hp
            );
            this.engine.addBody(body);
        })

        // Ajout du launcher
        let launcher = new Sprite(new Vector(100, this.level.ground.level - 165), 50, 165, Infinity, 'slingshot', Infinity);
        this.engine.addBody(launcher);
        this.bullet = this.createBullet()

        // Evénements du clavier
        
        window.onkeydown = function (e) {
            if (e.keyCode == 32 && game.bullet !== null && game.startedLaunchAt === null) {
                game.startedLaunchAt = Date.now();
            }
        };

        window.onkeyup = function (e) {
            if (e.keyCode == 32 && game.bullet !== null) {
                let duration = (Date.now() - game.startedLaunchAt) / 250;
                let unit = Math.min(3, Math.max(2, duration));

                game.bullet.force = new Vector(0.01 * unit,-0.01 * unit);

                game.startedLaunchAt = null;
                game.bullet = null;
                setTimeout(function () {
                    game.bullet = game.createBullet()
                }, 1000)
            }
        };

        // Interval

        let interval;

        interval = setInterval(function () {
            try {
                game.renderer.update(1000 / 60);
            } catch (e) {
                clearInterval(interval);
                throw e;
            }
        }, 1000 / 60);
    }

    // Permet d'obtenir une valeur entre 0 et 1 représentant la puissance d'envoi actuelle
    // (selon le temps de pression sur la barre d'espace)
    getLaunchProgress()
    {
        if (this.startedLaunchAt == null)
            return 0;

        let duration = (Date.now() - this.startedLaunchAt) / 250;
        return Math.min(3, duration) / 3;
    }

    // Créé un nouveau projectile
    createBullet()
    {
        let bullet;

        if (Math.random() > 0.5) {
            bullet = new Sprite(new Vector(100, this.level.ground.level - 215), 50, 50, 0.9, 'bullet1', 5);
        }
        else {
            bullet = new Sprite(new Vector(90, this.level.ground.level - 235), 70, 70, 1.2, 'bullet2', 10);
        }

        this.engine.addBody(bullet);
        return bullet;
    }
}