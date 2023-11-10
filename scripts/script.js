import { Camera } from "./camera.js";
import { Map } from "./map.js";
import { Player } from "./player.js";
import { Forest } from "./tiles/forest.js";
import { Camp } from "./tiles/camp.js";
import { Castle } from "./tiles/castle.js";

let canvas = document.querySelector('#gamecanvas');
var ctx = canvas.getContext('2d');
var gameobjects = [];
gameobjects.push(new Map(10, [new Player(), new Player()]));
let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

let clickedTile;

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);
    return [x, y];
}
canvas.addEventListener('mousedown', function(e) {
    const coordinates = getCursorPosition(canvas, e)
    
    clickedTile = camera.screenToHex(coordinates[0], coordinates[1], gameobjects[0])[0];
    trainArmy();
    placeCamp();
});

function trainArmy(){
    if (clickedTile instanceof Castle) {
        clickedTile.armyTrained = true;
    }
}

function placeCamp(){
    if (clickedTile != null && (clickedTile.empty || clickedTile instanceof Forest)) {
        gameobjects[0].matrix[clickedTile.y][clickedTile.x] = new Camp(clickedTile.y, clickedTile.x);
    }
}

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