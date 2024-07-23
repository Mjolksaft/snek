import segment from "./modules/segment.js"
import vector from "./modules/vector.js"

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const width = 500
const height = 500

canvas.width = width
canvas.height = height

const sizes = [20, 15, 10, 5, 5, 5]
const parts = []

// fish position, size, length
function setup() {
    let prevPart = null
    sizes.forEach(size => {
        const newPart = new segment(new vector(250, 250), size, 40, prevPart)
        parts.push(newPart)
        prevPart = newPart
    });

    addEventListener("mousemove", mouseMove)
    draw()
}

function mouseMove(event) {
    const rect = canvas.getBoundingClientRect()
    const newMousePos = new vector(event.clientX - rect.left, event.clientY - rect.top)

    if (newMousePos.x < width && newMousePos.y < height) {
        parts[0].target = newMousePos
    }
} 

function draw() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < parts.length; i++) {
        const element = parts[i];
        element.update()
        element.distanceConstrain()
        element.draw(ctx)
    }

    for (let i = 0; i < parts.length-1; i++) {
        const element = parts[i];
        const nextElement = parts[i + 1]
        ctx.beginPath()
        ctx.moveTo(element.leftLeg.x, element.leftLeg.y)
        ctx.lineTo(nextElement.leftLeg.x, nextElement.leftLeg.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(element.rightLeg.x, element.rightLeg.y)
        ctx.lineTo(nextElement.rightLeg.x, nextElement.rightLeg.y)
        ctx.stroke()
    }



    requestAnimationFrame(draw)
}

setup()