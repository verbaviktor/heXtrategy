import { Camera } from "./camera.js";
import { Map } from "./map.js";

let canvas = document.querySelector('#gamecanvas');
var ctx = canvas.getContext('2d');
var gameobjects = [];
gameobjects.push(new Map(12));
let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();
    for (const gameobject of gameobjects) {
        gameobject.render(ctx, camera);
    }


    lastTime = timestamp;

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);