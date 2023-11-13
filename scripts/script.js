import { Camera } from "./camera.js";
import { Map } from "./map.js";
import { Player } from "./player.js";
import { Forest } from "./tiles/forest.js";
import { Camp } from "./tiles/camp.js";
import { Castle } from "./tiles/castle.js";
import { Army } from "./tiles/army.js";
import { Mountain } from "./tiles/mountain.js";

let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');
export let map = new Map(10, [new Player(), new Player()]);
export let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

let moved = false;
let clickedTile;

canvas.addEventListener('mousedown', function(e) {
    console.log(camera.screenToHex(e.clientX, e.clientY));
    const hexCoordinates = camera.screenToHex(e.clientX, e.clientY);
    clickedTile = map.matrix[hexCoordinates[1]][hexCoordinates[0]];
    map.tileClicked(clickedTile);
});

canvas.addEventListener("mousemove", function(e){
    moved = true;
});

canvas.addEventListener("mouseup", function(e){
    console.log(e.clientX, e.clientY);
    const hexCoordinates = camera.screenToHex(e.clientX, e.clientY);
    const destination = map.matrix[hexCoordinates[1]][hexCoordinates[0]];
    if (moved) {
        moved = map.moveArmy(clickedTile, destination);
    }
});

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();
    map.render();
    lastTime = timestamp;
    
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);