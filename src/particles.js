
class Particle {
    /**
     * Current Particle Stack
     */
    static stack = [];

    /**
     * Create a new Particle instance
     */
    constructor() {
        Particle.stack.push(this);

        this.position = p5.Vector.random2D().mult(20);
        this.velocity = createVector(0, 0);
        this.accuracy = this.position.copy().mult(random(0.0005, 0.00001));
        this.width = random(3, 5);

        this._opacity = 1;
    }

    /**
     * Receive particle color
     * @returns 
     */
    get color() {
        let c = [
            currentColor.levels[0],
            currentColor.levels[1],
            currentColor.levels[2],
        ];
        return [
            c[0] + Math.min(255 - c[0], random(0, 255 - c[0])),
            c[1],
            c[2] + Math.min(255 - c[2], random(0, 255 - c[2])),
            80 * this._opacity
        ]
    }

    /**
     * Receive Opacity
     * @returns 
     */
    get opacity() {
        if (endScene) {
            this._opacity -= 0.01;
        }
        return this._opacity;
    }

    /**
     * Calculate if the particle is still visible (within the viewport + opacity > 0)
     * @returns 
     */
    visible() {
        return !(
            this.opacity <= 0
        || (this.position.x > 200 || this.position.x < -windowWidth)
        || (this.position.y > 200 || this.position.y < -windowHeight)
        );
    }

    /**
     * Update Particle position
     * @param {boolean} faster True to move a bit faster.
     */
    update(faster) {
        this.velocity.add(this.accuracy);
        this.position.add(this.velocity);
        if (faster) {
            this.position.add(this.velocity / 2);
        }
    }

    /**
     * Render Particle
     */
    render() {
        fill(this.color);
        ellipse(this.position.x - 100, this.position.y - 100, this.width);
    }
}
