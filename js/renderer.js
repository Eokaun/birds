class Renderer
{
    constructor (engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.lastLoop = Date.now()
    }

    // Ticker mettant à jour le canvas
    update (dt) {
        let canvas = this.canvas;
        let context = this.context;

        // On efface tout
        context.clearRect(0, 0, 1000, 600);

        // On dessine tous les objets
        this.engine.update(dt);
        this.engine.bodies.forEach(function (b) {
            b.draw(canvas, context);
        });

        // Extra: on dessine la puissance du lancée
        let progress = window.game.getLaunchProgress()
        let gradient = context.createLinearGradient(0,0,1000,0);
        gradient.addColorStop(1, 'red');
        gradient.addColorStop(0, 'yellow');
        context.fillStyle = gradient
        context.fillRect(0, 590, 1000 * progress, 10)

        // Affichage du FPS (DOM)
        let fps = Math.round(1000 / (Date.now() - this.lastLoop));
        document.getElementById('fps').innerText = fps + ' FPS';
        this.lastLoop = Date.now();
    }
}