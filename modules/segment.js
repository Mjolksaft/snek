import Vector from "./vector.js";

export default class Segment {
    constructor(position, size,  parent) { // Add maxAngle and minAngle with default values
        this.position = position;
        this.size = size;
        this.parent = parent;
        this.angle = -Math.PI/2;
        this.points = [];
        
    }

    update() {
        this.findLegs();
    }

    findLegs() {
        this.points = [];
        let leftLeg = new Vector(this.position.x + this.size * Math.cos(this.angle - Math.PI / 2), this.position.y + this.size * Math.sin(this.angle - Math.PI / 2));
        let rightLeg = new Vector(this.position.x + this.size * Math.cos(this.angle + Math.PI / 2), this.position.y + this.size * Math.sin(this.angle + Math.PI / 2));
        this.points.push(leftLeg);
        this.points.push(rightLeg);
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        for (let i = 0; i < this.points.length; i++) {
            if (i == 1) {
                ctx.fillStyle = "red";
                
            }
            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, 5, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        // ctx.fillStyle = "black";
        // ctx.beginPath();
        // ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        // ctx.closePath();
        // ctx.fill();

        // if (this.parent) {
        //     ctx.lineWidth = 10;
        //     ctx.strokeStyle = "blue";
        //     ctx.beginPath();
        //     ctx.moveTo(this.position.x, this.position.y);
        //     ctx.lineTo(this.parent.position.x, this.parent.position.y);
        //     ctx.stroke();
        // }
    }
}
