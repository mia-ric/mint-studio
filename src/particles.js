
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
    }

    /**
     * Receive particle color
     * @returns 
     */
    get color() {
        let c = [
            usedColor.levels[0],
            usedColor.levels[1],
            usedColor.levels[2],
        ];
        return [
            c[0] + Math.min(255 - c[0], random(0, 255 - c[0])),
            c[1],
            c[2] + Math.min(255 - c[2], random(0, 255 - c[2])),
            80
        ]
    }

    /**
     * Calculate if the particle is still within the viewport
     * @returns 
     */
    edges() {
        return this.position.x > (width * 2) || this.position.y > (height * 2);
    }

    /**
     * Update Particle
     * @param {boolean} faster True to move a bit faster.
     */
    update(faster) {
        fill(this.color);
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
        noStroke();
        fill(this.color);
        ellipse(this.position.x - 100, this.position.y - 100, this.width);
    }
}
