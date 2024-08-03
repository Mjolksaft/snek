import Snake from "./modules/snake.js";

let canvas, ctx;
const width = 500;
const height = 500;
let snake;

function setup() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    snake = new Snake([20, 15,10 , 5 , 5], 40);
    gameLoop();
}

function gameLoop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    snake.update();
    snake.draw(ctx);

    requestAnimationFrame(gameLoop);
}

setup();
