import vector from "./vector.js";
import Segment from "./segment.js";

export default class Head extends Segment {
    constructor(position, size, maxLength, next, maxAngle = Math.PI / 4, minAngle = -Math.PI / 4) {
        super(position, size, maxLength, next, maxAngle, minAngle);
        this.mousePosition = new vector(250, 0);

        // Event listener to track mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        });
    }

    update() {
        super.update();
        this.move();
    }

    move() {
        if (this.mousePosition) {
            let a = this.position.x - this.mousePosition.x;
            let b = this.position.y - this.mousePosition.y;
            let length = Math.sqrt(a ** 2 + b ** 2);
            if (length > 1) {
                this.angle = Math.atan2(this.position.y - this.mousePosition.y, this.position.x - this.mousePosition.x);
                
                // Constrain the angle
                // this.constrainAngle();

                this.position.x += -1 * Math.cos(this.angle);
                this.position.y += -1 * Math.sin(this.angle);
            }

            // for the legs 
            let faceLeft = new vector(this.position.x + this.size * Math.cos(this.angle - Math.PI / 6 * 5), this.position.y + this.size * Math.sin(this.angle - Math.PI / 6 * 5));
            let faceRight = new vector(this.position.x + this.size * Math.cos(this.angle + Math.PI / 6 * 5), this.position.y + this.size * Math.sin(this.angle + Math.PI / 6 * 5));
            
            this.points.push(faceLeft);
            this.points.push(faceRight);
        }
    }
}
