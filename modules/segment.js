import vector from "./vector.js"

export default class segment {
    constructor(position, size, maxLength, next) {
        this.position = position
        this.size = size
        this.maxLength = maxLength
        this.next = next
        this.angle = null
        this.leftLeg = null
        this.rightLeg = null
    }

    update() {

        this.angle = Math.atan2(this.position.y - this.next.position.y,
            this.position.x - this.next.position.x);

        this.leftLeg = new vector(this.position.x + this.size * Math.cos(this.angle - Math.PI / 2), this.position.y + this.size * Math.sin(this.angle - Math.PI / 2))
        this.rightLeg = new vector(this.position.x + this.size * Math.cos(this.angle + Math.PI / 2), this.position.y + this.size * Math.sin(this.angle + Math.PI / 2))
    }

    distanceConstrain() {
        // check length of line 
        let a = this.position.x - this.next.position.x
        let b = this.position.y - this.next.position.y
        let length = Math.sqrt(a ** 2 + b ** 2)

        if (length > this.maxLength) {
            this.position.x = this.next.position.x + this.maxLength * Math.cos(this.angle)
            this.position.y = this.next.position.y + this.maxLength * Math.sin(this.angle)
        }
    }

    draw(ctx) {

        // where the legs are 
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(this.leftLeg.x, this.leftLeg.y, 5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.rightLeg.x, this.rightLeg.y, 5, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()


    }
}