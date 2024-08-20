export default class Segment {
    constructor(pos, size) {
        this.pos = pos
        this.size = size
        this.angle = 0
    }

    getSize() {
        return this.size
    }

    getPos() {
        return this.pos
    }

    setPos(newPos) {
        this.pos = newPos
    }

    draw(ctx) {
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, false)
        ctx.stroke();
    }
    
}