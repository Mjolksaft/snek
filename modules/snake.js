import Spine from "./Spine.js";
import Vector from "./Vector.js";

export default class Snake {
    constructor(startPos) {
        this.pos = startPos;
        this.spine = new Spine([15,10,5,5,5,5], startPos, 30);
        this.speed = 0.5;
        this.head = this.spine.segments[0];

        this.mousePos = new Vector(260, 250);
        this.targetPos = startPos;

        window.addEventListener('mousemove', (event) => {
            this.mousePos = new Vector(event.clientX, event.clientY);
        });
    }

    update() {

        this.targetPos = this.calculateTargetPosition();
        
        this.spine.update(this.targetPos);
    }

    calculateTargetPosition() {
        // Calculate the distance from the head to the mouse position
        let distance = Math.sqrt((this.mousePos.x - this.head.pos.x) ** 2 + (this.mousePos.y - this.head.pos.y) ** 2);
        
        if (distance > 2) {
            // Calculate the angle from the head to the mouse position
            const angle = Vector.angle(this.mousePos, this.head.pos);
            
            // Update the target position based on the speed and direction
            return new Vector(
                this.head.pos.x + this.speed * Math.cos(angle),
                this.head.pos.y + this.speed * Math.sin(angle)
            );
        }
        
        return this.targetPos;
    }

    draw(ctx) {
        this.spine.draw(ctx)
        const angle = Vector.angle(this.mousePos, this.head.pos);
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            this.head.pos.x + Math.cos(angle) * this.head.size,
            this.head.pos.y + Math.sin(angle) * this.head.size,
            2, 0, Math.PI * 2, false
        );
        ctx.fill()

    }
}