import vector from "./vector.js"

export default class head {
    constructor(position) {
        this.position = position
        this.target = null
        this.angle = 0

        this.size = 20

        this.points = []
    }

    move() {
        if (this.target) {
            let a = this.position.x - this.target.x
            let b = this.position.y - this.target.y
            let length = Math.sqrt(a ** 2 + b ** 2)
            if (length > 1) {
                this.angle = Math.atan2(this.position.y - this.target.y,
                    this.position.x - this.target.x);

                this.position.x += -1 * Math.cos(this.angle)
                this.position.y += -1 * Math.sin(this.angle)
            }

            let leftLeg = new vector(this.position.x + this.size * Math.cos(this.angle - Math.PI / 2), this.position.y + this.size * Math.sin(this.angle - Math.PI / 2))
            let rightLeg = new vector(this.position.x + this.size * Math.cos(this.angle + Math.PI / 2), this.position.y + this.size * Math.sin(this.angle + Math.PI / 2))
            let faceLeft = new vector(this.position.x + this.size * Math.cos(this.angle - Math.PI/6 * 5), this.position.y + this.size * Math.sin(this.angle - Math.PI/6 * 5))
            let faceRight = new vector(this.position.x + this.size * Math.cos(this.angle + Math.PI/6 * 5), this.position.y + this.size * Math.sin(this.angle + Math.PI/6 * 5))

                
            this.points = []
            this.points.push(leftLeg)
            // this.points.push(faceLeft)
            // this.points.push(faceRight)
            this.points.push(rightLeg)
        }
    }

    setTarget(newTarget) {
        this.target = newTarget
    }

    draw(ctx) {
        for (let i = 0; i < this.points.length; i++) {
            ctx.fillStyle = "red"
            ctx.beginPath()
            ctx.arc(this.points[i].x, this.points[i].y, 5, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        }
        
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        // for (let i = 0; i < this.points.length-1; i++) {
        //     ctx.strokeStyle = "red"
        //     ctx.beginPath()
        //     ctx.moveTo(this.points[i].x, this.points[i].y)
        //     ctx.lineTo(this.points[i + 1].x, this.points[i+1].y)
        //     ctx.stroke()
            
        // }


    }
}