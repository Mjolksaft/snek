import Segment from "./Segment.js";
import Vector from "./Vector.js";

export default class Limb {
    constructor(joints, rootPosition, orientation, index) {
        this.joints = [];
        for (let i = 0; i < joints; i++) {
            this.joints.push(new Segment(new Vector(250, 250),5))
        }
        
        this.orientation = orientation
        this.rootPosition = rootPosition
        this.index = index

        this.length = 30;
        this.target = new Vector(this.joints[0].pos.x + Math.cos(this.rootPosition.angle) * this.length, this.joints[0].pos.y + Math.sin(this.rootPosition.angle) * this.length);
        this.speed = 0.1;
        this.newTarget = null;

        this.grounded = true
    }

    update() {
        this.adjustTargetIfNeeded(this.target, this.rootPosition.pos, this.length * 2);
            this.performForwardReaching(this.target);
            this.performBackwardReaching(this.rootPosition.pos);
            
        if (this.newTarget) {
            this.target = Vector.lerp(this.target, this.newTarget, this.speed);
            this.updateMovementState()
        }
    }

    updateMovementState() {
        //draw target
        this.grounded = Vector.distance(this.target, this.newTarget) < 5
        if (this.grounded) {
            this.newTarget = null
            
        }
    }

    move(newPos) {
        this.rootPosition = newPos
    }

    adjustTargetIfNeeded(target, rootPosition, threshold) {
        let distance = Vector.distance(target, rootPosition);
        if (distance > threshold) {
            
            this.newTarget = new Vector(
                rootPosition.x + Math.cos(this.rootPosition.angle - Math.PI/4 * this.orientation) * threshold,
                rootPosition.y + Math.sin(this.rootPosition.angle - Math.PI/4 * this.orientation) * threshold
            );
        } 
    }

    performForwardReaching(target) {
        this.joints[this.joints.length - 1].pos = target;
        for (let i = this.joints.length - 2; i >= 0; i--) {
            let direction = Vector.norm(Vector.sub(this.joints[i + 1].pos, this.joints[i].pos));
            this.joints[i].pos = Vector.sub(this.joints[i + 1].pos, Vector.scale(direction, this.length));
        }
    }

    performBackwardReaching(rootPosition) {
        this.joints[0].pos = rootPosition;
        for (let i = 1; i < this.joints.length; i++) {
            let direction = Vector.norm(Vector.sub(this.joints[i].pos, this.joints[i - 1].pos));
            this.joints[i].pos = Vector.add(this.joints[i - 1].pos, Vector.scale(direction, this.length));
        }
    }

    draw(ctx) {
        ctx.strokeStyle = "black"
        // draw control points 
        for (let i = 0; i < this.joints.length; i++) {
            const joint = this.joints[i];
            
            ctx.lineWidth = 2;
            ctx.beginPath()
            ctx.arc(joint.pos.x, joint.pos.y, joint.size, 0, Math.PI * 2)
            ctx.stroke()
        }

        // draw Line between
        for (let i = 0; i < this.joints.length - 1; i++) {
            const limb = this.joints[i];
            const next = this.joints[i + 1];

            const angle = Vector.angle(next.pos, limb.pos)

            ctx.lineWidth = 4;
            ctx.beginPath()
            ctx.moveTo(limb.pos.x + Math.cos(angle) * limb.size, limb.pos.y + Math.sin(angle) * limb.size)
            ctx.lineTo(next.pos.x - Math.cos(angle) * next.size, next.pos.y - Math.sin(angle) * next.size)
            ctx.stroke()
        }

        // if (this.newTarget) {
        //     //draw target
        //     ctx.beginPath()
        //     ctx.arc(this.newTarget.x, this.newTarget.y, 10, 0, Math.PI * 2)
        //     ctx.stroke()

        // }
        
        // if (this.grounded) {
        //     ctx.strokeStyle = "green"
        // } 
        // ctx.beginPath()
        // ctx.arc(this.target.x, this.target.y, 10, 0, Math.PI * 2)
        // ctx.stroke()
    }
}
