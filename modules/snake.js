import Segment from "./segment.js";
import Vector from "./vector.js";

export default class Snake {
    constructor(sizes, distance) {
        this.distance = distance
        this.maxAngle = Math.PI / 2
        this.head = new Segment(new Vector(250, 250), sizes[0], null)
        this.parts = [this.head];
        for (let i = 1; i < sizes.length; i++) {
            this.parts.push(new Segment(new Vector(250, 250 + this.distance * i), sizes[i], this.parts[i - 1]));
        }
        this.mousePosition = new Vector(250, 0);

        // Event listener to track mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        });
    }

    update() {
        this.parts.forEach((part, i) => {
            part.update();
            if (i !== 0) this.followParent(part);
        });

        this.constrainAngle();
        this.followMouse();
    }

    followMouse() {
        if (this.mousePosition && this.head) {
            let a = this.mousePosition.x - this.head.position.x;
            let b = this.mousePosition.y - this.head.position.y;
            let length = Math.sqrt(a ** 2 + b ** 2);

            if (length > 1) {
                this.head.angle = Math.atan2(b, a);

                this.head.position.x += 1 * Math.cos(this.head.angle);
                this.head.position.y += 1 * Math.sin(this.head.angle);
            }
            
            // for the legs 
            let faceLeft = new Vector(this.head.position.x - this.head.size * Math.cos(this.head.angle - Math.PI / 6 * 5), this.head.position.y - this.head.size * Math.sin(this.head.angle - Math.PI / 6 * 5));
            let faceRight = new Vector(this.head.position.x - this.head.size * Math.cos(this.head.angle + Math.PI / 6 * 5), this.head.position.y - this.head.size * Math.sin(this.head.angle + Math.PI / 6 * 5));
            
            const index = 1;
            const newPoints = [
                ...this.head.points.slice(0, index),
                faceRight,
                faceLeft,
                ...this.head.points.slice(index)
            ];

            this.head.points = newPoints
        }
    }

    followParent(part) { // distance constrain
        let target = new Vector(part.parent.position.x, part.parent.position.y);
        let distance = Vector.distance(part.position, target);
        let angle = Vector.angle(part.position, target);

        if (distance > this.distance || distance < this.distance) {
            let moveVector = Vector.fromAngle(angle, this.distance);
            part.position.x = target.x - moveVector.x;
            part.position.y = target.y - moveVector.y;
        }

        part.angle = angle;
    }

    constrainAngle() {
        for (let i = 1; i < this.parts.length - 1; i++) {
            let A = this.parts[i - 1];
            let B = this.parts[i];
            let C = this.parts[i + 1];

            // Calculate vectors AB and BC
            let AB = new Vector(B.position.x - A.position.x, B.position.y - A.position.y);
            let BC = new Vector(C.position.x - B.position.x, C.position.y - B.position.y);

            // Calculate the Dot Product
            let dotProduct = AB.x * BC.x + AB.y * BC.y;

            // Calculate the Magnitudes
            let magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
            let magBC = Math.sqrt(BC.x ** 2 + BC.y ** 2);

            // Calculate the Cosine of the Angle
            let cosTheta = dotProduct / (magAB * magBC);

            // Handle floating point precision issues
            let angleInRadians = Math.acos(Math.max(-1, Math.min(1, cosTheta)));

            // Check if the angle exceeds the maximum allowed angle
            if (angleInRadians > this.maxAngle) {
                let excessAngle = angleInRadians - this.maxAngle;
                let adjustmentAngle = excessAngle / 2;

                let crossProduct = AB.x * BC.y - AB.y * BC.x;

                // Determine the rotation direction based on the cross product
                if (crossProduct > 0) {
                    adjustmentAngle = -adjustmentAngle;
                }

                // Rotate segment C around B
                let rotatedCX = Math.cos(adjustmentAngle) * (C.position.x - B.position.x) - Math.sin(adjustmentAngle) * (C.position.y - B.position.y) + B.position.x;
                let rotatedCY = Math.sin(adjustmentAngle) * (C.position.x - B.position.x) + Math.cos(adjustmentAngle) * (C.position.y - B.position.y) + B.position.y;

                C.position.x = rotatedCX;
                C.position.y = rotatedCY;

                // Rotate segment A around B in the opposite direction
                let rotatedAX = Math.cos(-adjustmentAngle) * (A.position.x - B.position.x) - Math.sin(-adjustmentAngle) * (A.position.y - B.position.y) + B.position.x;
                let rotatedAY = Math.sin(-adjustmentAngle) * (A.position.x - B.position.x) + Math.cos(-adjustmentAngle) * (A.position.y - B.position.y) + B.position.y;

                A.position.x = rotatedAX;
                A.position.y = rotatedAY;
            }
        }
    }




    draw(ctx) {
        this.parts.forEach(part => {
            part.draw(ctx);

        });
        this.drawLines(ctx)
    }

    drawLines(ctx) {
        let length = this.parts.length
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < length - 1; i++) {
            const vector1 = this.parts[i].points[0];
            const vector2 = this.parts[i + 1].points[0];
            ctx.moveTo(vector1.x, vector1.y);
            ctx.lineTo(vector2.x, vector2.y);
        }
        ctx.strokeStyle = 'blue'; // Color for the first set of lines
        ctx.stroke();

        // Draw lines between second vectors
        ctx.beginPath();
        for (let i = 0; i < length - 1; i++) {
            const vector1 = this.parts[i].points[this.parts[i].points.length-1];
            const vector2 = this.parts[i + 1].points[this.parts[i+1].points.length-1];
            ctx.moveTo(vector1.x, vector1.y);
            ctx.lineTo(vector2.x, vector2.y);
        }
        ctx.strokeStyle = 'red'; // Color for the second set of lines
        ctx.stroke();

        // draw face 
        ctx.beginPath();
        for (let i = 0; i < this.head.points.length-1; i++) {
            const vector1 = this.head.points[i];
            const vector2 = this.head.points[i + 1];
            ctx.moveTo(vector1.x, vector1.y);
            ctx.lineTo(vector2.x, vector2.y);
        }
        ctx.strokeStyle = 'red'; // Color for the second set of lines
        ctx.stroke();

        // draw tail 
        ctx.beginPath();
        const vector1 = this.parts[length-1].points[1];
        const vector2 = this.parts[length-1].points[0];
        ctx.moveTo(vector1.x, vector1.y);
        ctx.lineTo(vector2.x, vector2.y);
        ctx.strokeStyle = 'blue'; // Color for the second set of lines
        ctx.stroke();
    }


}
