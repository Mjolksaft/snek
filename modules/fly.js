import Spine from "./Spine.js";
import Spline from "./spline.js";
import Vector from "./Vector.js";

export default class Fly {
    constructor(startPos) {
        this.pos = startPos;
        this.spine = new Spine([15, 5, 15, 15, 5, 8, 5, 5, 5, 5, 5, 5, 5, 5], startPos, 15);
        this.speed = 2;
        this.head = this.spine.segments[0];

        this.points = []

        this.mousePos = new Vector(260, 250);
        this.targetPos = startPos;

        this.flapSpeed = 0.05; // Controls the speed of the flapping
        this.flapAmplitude = Math.PI / 8; // Controls how much the fins flap
        this.time = 0;

        window.addEventListener('mousemove', (event) => {
            this.mousePos = new Vector(event.clientX, event.clientY);
        });
    }

    update() {
        this.targetPos = this.calculateTargetPosition();
        if (this.targetPos) {
            this.spine.update(this.targetPos);

        }
        this.drawingPoints()
        this.time += this.flapSpeed;
    }

    calculateTargetPosition() {
        // Calculate the distance from the head to the mouse position
        let distance = Math.sqrt((this.mousePos.x - this.head.pos.x) ** 2 + (this.mousePos.y - this.head.pos.y) ** 2);

        if (distance > 3) {
            // Calculate the angle from the head to the mouse position
            const angle = Vector.angle(this.mousePos, this.head.pos);

            // Update the target position based on the speed and direction
            return new Vector(
                this.head.pos.x + this.speed * Math.cos(angle),
                this.head.pos.y + this.speed * Math.sin(angle)
            );
        }
        return null
    }

    drawingPoints() {
        // find the position of the outline with exceptions of the head and tail
        let newPoints = []

        let segments = this.spine.segments

        //for the right side
        for (let i = 0; i < segments.length; i++) {
            let size = segments[i].size
            let angle = segments[i].angle + Math.PI / 2
            let pos = segments[i].pos
            let point = new Vector(
                pos.x + Math.cos(angle) * size,
                pos.y + Math.sin(angle) * size
            );
            newPoints.push(point)
        }
        // For the tail        
        let size = this.spine.segments[this.spine.segments.length - 1].size;
        let angle = this.spine.segments[this.spine.segments.length - 1].angle + Math.PI;
        let pos = this.spine.segments[this.spine.segments.length - 1].pos;
        let point = new Vector(
            pos.x + Math.cos(angle) * size,
            pos.y + Math.sin(angle) * size
        );
        newPoints.push(point);  // Corrected to use unshift instead of shift

        //for the leftSide
        for (let i = segments.length - 1; i >= 0; i--) {
            let size = segments[i].size
            let angle = segments[i].angle - Math.PI / 2
            let pos = segments[i].pos
            let point = new Vector(
                pos.x + Math.cos(angle) * size,
                pos.y + Math.sin(angle) * size
            );
            newPoints.push(point)
        }

        // For the head        
        size = this.head.size;
        angle = this.head.angle;
        pos = this.head.pos;
        point = new Vector(
            pos.x + Math.cos(angle) * size,
            pos.y + Math.sin(angle) * size
        );
        newPoints.push(point);

        newPoints.push(...newPoints.slice(0, 3)); // add the neccessary points to make a loop

        this.points = newPoints

    }

    draw(ctx) {
        // this.spine.draw(ctx)
        ctx.lineWidth = 4;
        let line = Spline.generateSplinePoints(this.points, 20)
        // Draw the spline
        ctx.fillStyle = "lightBlue"
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
            ctx.lineTo(line[i].x, line[i].y);
        }
        ctx.fill();
        ctx.stroke()

        //draw eyes     
        let length = this.head.size - 5;
        let angle = this.head.angle;
        let adjustment = Math.PI / 2
        let pos = this.head.pos;
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.arc(
            pos.x + Math.cos(angle - adjustment) * length,
            pos.y + Math.sin(angle - adjustment) * length,
            10,
            0,
            Math.PI * 2
        );
        ctx.fill()

        ctx.beginPath()
        ctx.arc(
            pos.x + Math.cos(angle + adjustment) * length,
            pos.y + Math.sin(angle + adjustment) * length,
            10,
            0,
            Math.PI * 2
        );
        ctx.fill()


        const drawFin = (direction, rotationAngle) => {
            const flapAngle = Math.sin(this.time*4) * this.flapAmplitude;
            
            const segment = this.spine.segments[3];
            
            ctx.save();
            
            ctx.translate(segment.pos.x, segment.pos.y);
            
            ctx.rotate(segment.angle + rotationAngle + flapAngle * direction);
            
            ctx.beginPath();
            ctx.ellipse(50, 0, 40, 10, 0, 0, Math.PI * 2); // Center ellipse at (0, 0)
            ctx.fill();
            
            ctx.restore();
        };
        
        // Example usage:
        const finSize = 40;
        drawFin(1, Math.PI / 2); 
        drawFin(-1, -Math.PI/2); 
        drawFin(1,  Math.PI / 1.5); 
        drawFin(-1,  -Math.PI / 1.5);
    }

    
}