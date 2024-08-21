import Limb from "./limb.js";
import Segment from "./Segment.js";
import Vector from "./Vector.js";

export default class Spine {
    constructor(sizes, startPos, maxDistance, legs = null) {
        this.segments = []
        this.maxDistance = maxDistance
        this.maxAngle = Math.PI / 4
        this.turn = true

        for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i];
            const pos = new Vector(startPos.x - maxDistance * i, startPos.y)
            this.segments.push(new Segment(pos, size))
        }

        this.legs = []
        if (legs) {
            for (let i = 0; i < legs.length; i++) {
                console.log(legs[i]);
                
                this.legs.push(new Limb(3, this.segments[legs[i]], 1, legs[i]))            
                this.legs.push(new Limb(3, this.segments[legs[i]], -1, legs[i]))            
            }
        }
        
    }

    update(targetPos) {
        if (this.segments.length > 2) {
            let A = targetPos
            let B = this.segments[0].pos
            let C = this.segments[1].pos 
            
            this.adjustAngleAndRotate(A, B, C, true, false);
            
            // rest of the cases
            for (let i = 1; i < this.segments.length - 1; i++) {
                A = this.segments[i - 1].pos
                B = this.segments[i].pos
                C = this.segments[i + 1].pos
                this.adjustAngleAndRotate(A, B, C, true, true);
            }
        }
        
        for (let i = 0; i < this.segments.length - 1; i++) {
            const element = this.segments[i];
            const nextElement = this.segments[i + 1];
            this.constrainDistance(element, nextElement);
        }

        
        this.segments[0].angle = Vector.angle(targetPos, this.segments[0].pos)
        this.segments[0].pos = targetPos

        
        for (let i = 0; i < this.legs.length; i++) {
            const leg = this.legs[i];
            leg.move(this.segments[leg.index])
            leg.update()
        }
    }

    

    constrainDistance(element, nextElement) {
        const distance = Vector.distance(element.pos, nextElement.pos)

        if (distance < this.maxDistance || distance > this.maxDistance) {
            const angle = Vector.angle(element.pos, nextElement.pos)
            nextElement.pos.x = element.pos.x - this.maxDistance * Math.cos(angle)
            nextElement.pos.y = element.pos.y - this.maxDistance * Math.sin(angle)
            nextElement.angle = angle
        }
    }

    adjustAngleAndRotate(A, B, C, rotateA = true, rotateC = true) {
        let AB = new Vector(B.x - A.x, B.y - A.y);
        let BC = new Vector(C.x - B.x, C.y - B.y);
        let angleInRadians = this.relativeAngle(AB, BC);
    
        if (angleInRadians > this.maxAngle) {
            let excessAngle = angleInRadians - this.maxAngle;
            let adjustmentAngle = rotateA && rotateC ? excessAngle / 2 : excessAngle;
    
            let crossProduct = AB.x * BC.y - AB.y * BC.x;
    
            if (crossProduct > 0) {
                adjustmentAngle = -adjustmentAngle;
            }
    
            // Rotate points based on the flags
            if (rotateC) this.rotateRelative(C, B, adjustmentAngle);
            if (rotateA) this.rotateRelative(A, B, -adjustmentAngle);
        }
    }
    


    rotateRelative(point, pivot, adjustmentAngle) {
        let rotatedX = Math.cos(adjustmentAngle) * (point.x - pivot.x) - Math.sin(adjustmentAngle) * (point.y - pivot.y) + pivot.x;
        let rotatedY = Math.sin(adjustmentAngle) * (point.x - pivot.x) + Math.cos(adjustmentAngle) * (point.y - pivot.y) + pivot.y;

        // Update the original point's coordinates
        point.x = rotatedX;
        point.y = rotatedY;

    }

    relativeAngle(AB, BC) {

        let dotProduct = AB.x * BC.x + AB.y * BC.y;

        let magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
        let magBC = Math.sqrt(BC.x ** 2 + BC.y ** 2);

        let cosTheta = dotProduct / (magAB * magBC); // a . b = |A||B| * Cos(Theta)

        let angleInRadians = Math.acos(Math.max(-1, Math.min(1, cosTheta)));

        return angleInRadians

    }

    draw(ctx) {
        for (let i = 0; i < this.legs.length; i++) {
            const leg = this.legs[i];
            leg.draw(ctx)
        }
        // ctx.lineWidth = 1
        // ctx.strokeStyle = "black"
        // for (let i = 0; i < this.segments.length; i++) {
        //     const element = this.segments[i];
        //     element.draw(ctx)

        // }

    }
}