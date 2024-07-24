import snakeClass from "./modules/snake.js"
import vector from "./modules/vector.js"

let canvas
let ctx

const width = 500
const height = 500

let snake;

// fish position, size, length
function setup() {
    canvas = document.querySelector("canvas")
    ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    snake = new snakeClass([20, 15, 10, 5, 5])

    addEventListener("mousemove", mouseMove)
    gameLoop()
}

function mouseMove(event) {
    const rect = canvas.getBoundingClientRect()
    const newMousePos = new vector(event.clientX - rect.left, event.clientY - rect.top)

    if (newMousePos.x < width && newMousePos.y < height) {
        snake.head.setTarget(newMousePos)
    }
}

function gameLoop() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    snake.update()
    snake.draw(ctx)

    requestAnimationFrame(gameLoop)
}

setup()