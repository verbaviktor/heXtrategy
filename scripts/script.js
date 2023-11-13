import { Camera } from "./camera.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');
export let map = new Map(10, [new Player(), new Player()]);
export let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

canvas.addEventListener('mousedown', function(e) {
    console.log(camera.screenToHex(e.clientX, e.clientY))
});

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();

    map.render()


    lastTime = timestamp;

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);