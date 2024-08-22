import Segment from "./Segment.js";
import Vector from "./Vector.js";

export default class Limb {
    constructor(joints, rootPosition, orientation, index) {
        this.joints = [];
        for (let i = 0; i < joints; i++) {
            this.joints.push(new Segment(new Vector(250, 250), 5))
        }

        this.orientation = orientation
        this.rootPosition = rootPosition
        this.index = index

        this.length = 30;
        this.target = new Vector(this.joints[0].pos.x + Math.cos(this.rootPosition.angle) * this.length, this.joints[0].pos.y + Math.sin(this.rootPosition.angle) * this.length);
        this.speed = 0.1;
        this.canMove = true
        this.grounded = true
    }

    update() {
        //when do we move the target ? 
        //how do we move the target ? 
        // we move the target when out of range 
        // when we have a new target and is allowed to move set the new target to the target and change canMove to false so we dont get a new position
        // also check so that we are currently grounded when changing new target so we don move the limb when its not in the ground
        let distance = Vector.distance(this.target, this.joints[this.joints.length-1].pos);
        
        let newTarget;
        if (distance > 10) {
            newTarget = this.moveTarget(this.rootPosition, this.length * 2)
        } else {
            this.grounded = true
        }

        if (this.canMove && this.grounded && newTarget) {
            this.target = newTarget
            this.grounded = false
            this.canMove = false
        }

        // the part that moves the actual limb to the target 
        // do we move the limb to the target or do we lerp it to the location
        // we get the current location of the last joint and lerp it into the target 
        const newPos = Vector.lerp(this.joints[this.joints.length - 1].pos, this.target, this.speed)
        this.performForwardReaching(newPos);
        this.performBackwardReaching(this.rootPosition.pos);
    }

    setTarget(newTarget) {
        this.target = newTarget
    }
    
    moveTarget(rootPosition, threshold) {
        return new Vector(
            rootPosition.pos.x + Math.cos(rootPosition.angle - Math.PI / 4 * this.orientation) * threshold,
            rootPosition.pos.y + Math.sin(rootPosition.angle - Math.PI / 4 * this.orientation) * threshold
        );
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
            if (i == 2) {
                ctx.strokeStyle = "red"
            }
            const joint = this.joints[i];

            ctx.lineWidth = 2;
            ctx.beginPath()
            ctx.arc(joint.pos.x, joint.pos.y, joint.size, 0, Math.PI * 2)
            ctx.stroke()
        }
        ctx.strokeStyle = "black"

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

        if (this.grounded) {
            ctx.strokeStyle = "green"
        } 
        ctx.beginPath()
        ctx.arc(this.target.x, this.target.y, 10, 0, Math.PI * 2)
        ctx.stroke()
    }
}
