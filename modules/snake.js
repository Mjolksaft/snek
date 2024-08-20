import Spine from "./Spine.js";
import Spline from "./spline.js";
import Vector from "./Vector.js";

export default class Snake {
    constructor(startPos) {
        this.pos = startPos;
        this.spine = new Spine([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15], startPos, 15);
        this.speed = 1;
        this.head = this.spine.segments[0];

        this.points = []

        this.mousePos = new Vector(260, 250);
        this.targetPos = startPos;

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

        // for (let i = 0; i < this.points.length; i++) {
        //     ctx.fillStyle = 'red';
        //     ctx.beginPath();
        //     ctx.arc(
        //         this.points[i].x,
        //         this.points[i].y,
        //         2, 0, Math.PI * 2, false
        //     );
        //     ctx.fill()
        // }

        
        //draw eyes
        // For the head        
        let length = this.head.size - 5;
        let angle = this.head.angle;
        let adjustment = Math.PI/2
        let pos = this.head.pos;
        ctx.fillStyle = 'red';
        ctx.beginPath()
        ctx.arc(           
            pos.x + Math.cos(angle- adjustment) * length,
            pos.y + Math.sin(angle- adjustment) * length,
            2,
            0,
            Math.PI*2
        );
        ctx.fill()

        ctx.beginPath()
        ctx.arc(           
            pos.x + Math.cos(angle+ adjustment) * length,
            pos.y + Math.sin(angle+ adjustment) * length,
            2,
            0,
            Math.PI*2
        );
        ctx.fill()
        // ctx.beginPath()
        // ctx.arc(                        
        //     pos.x + Math.cos(angle) * length,
        //     pos.y + Math.sin(angle) * length,
        //     2,
        //     0,
        //     Math.PI*2
        // );
        // ctx.fill()

        let line = Spline.generateSplinePoints(this.points, 20)

        // Draw the spline
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
            ctx.lineTo(line[i].x, line[i].y);
        }
        ctx.stroke();
    }
}