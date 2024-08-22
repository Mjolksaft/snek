import Fly from "./modules/fly.js";
import Lizard from "./modules/lizard.js";
import Snake from "./modules/Snake.js";
import Vector from "./modules/Vector.js";

let canvas, ctx;
const width = 500;
const height = 500;

let snake;

let lastTime = 0;
let fps = 0;

function setup() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    snake = new Lizard(new Vector(250, 250));
    
    requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    // Calculate FPS
    const deltaTime = currentTime - lastTime;
    fps = 1000 / deltaTime;
    lastTime = currentTime;

    // Clear the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Draw the snake
    snake.update();
    snake.draw(ctx);

    // Draw FPS on the canvas
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`FPS: ${fps.toFixed(0)}`, 10, 20);

    // Call the next frame
    requestAnimationFrame(gameLoop);
}

setup();
