import segment from "./segment.js";
import vector from "./vector.js";
import head from "./head.js"

export default class snake {
    // create a snake 
    constructor(sizes) {
        // create body parts based on array of sizes 
        this.head = new head(new vector(250,250))
        this.parts = [new segment(new vector(250, 250), sizes[0], 40, this.head)]
        for (let i = 1; i < sizes.length; i++) {
            this.parts.push(new segment(new vector(250, 250), sizes[i], 40, this.parts[i - 1]))            
        }
    }

    update() {
        this.head.move()
        this.parts.forEach(part => {
            part.update()
            part.distanceConstrain()
        });
    }
    
    draw(ctx) {
        this.parts.forEach(part => {
            part.draw(ctx)
        });
        
        this.head.draw(ctx)
        // if (this.head.points.length > 0) {
        //     ctx.strokeStyle = "red"
        //     ctx.beginPath()
        //     ctx.moveTo(this.head.points[0].x, this.head.points[0].y)
        //     ctx.lineTo(this.parts[0].leftLeg.x, this.parts[0].leftLeg.y)
        //     ctx.stroke()
    
        //     ctx.strokeStyle = "red"
        //     ctx.beginPath()
        //     ctx.moveTo(this.head.points[this.head.points.length-1].x, this.head.points[this.head.points.length-1].y)
        //     ctx.lineTo(this.parts[0].rightLeg.x, this.parts[0].rightLeg.y)
        //     ctx.stroke()
        // }

        // for (let i = 0; i < this.parts.length-1; i++) {
        //     ctx.strokeStyle = "red"
        //     ctx.beginPath()
        //     ctx.moveTo(this.parts[i].leftLeg.x, this.parts[i].leftLeg.y)
        //     ctx.lineTo(this.parts[i + 1].leftLeg.x, this.parts[i + 1].leftLeg.y)
        //     ctx.stroke()
        // }
        // for (let i = 0; i < this.parts.length-1; i++) {
        //     ctx.strokeStyle = "red"
        //     ctx.beginPath()
        //     ctx.moveTo(this.parts[i].rightLeg.x, this.parts[i].rightLeg.y)
        //     ctx.lineTo(this.parts[i + 1].rightLeg.x, this.parts[i + 1].rightLeg.y)
        //     ctx.stroke()
        // }

        // ctx.strokeStyle = "red"
        // ctx.beginPath()
        // ctx.moveTo(this.parts[this.parts.length-1].leftLeg.x, this.parts[this.parts.length-1].leftLeg.y)
        // ctx.lineTo(this.parts[this.parts.length-1].rightLeg.x, this.parts[this.parts.length-1].rightLeg.y)
        // ctx.stroke()

    }
}