import { Camera } from "./camera.js";
import { Map } from "./map.js";
import { Player } from "./player.js";
import { Forest } from "./tiles/forest.js";
import { Camp } from "./tiles/camp.js";
import { Castle } from "./tiles/castle.js";
import { Army } from "./tiles/army.js";
import { Mountain } from "./tiles/mountain.js";

let canvas = document.querySelector('#gamecanvas');
var ctx = canvas.getContext('2d');
var gameobjects = [];
gameobjects.push(new Map(10, [new Player(), new Player()]));
let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

let clickedTile;
let moved = false;

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);
    return [x, y];
}
const moveListener = () => {
    moved = true;
}
function tileIsOnTheMap(tileX, tileY){
    if(tileX < 0 || tileX > gameobjects[0].diameter - 1 || tileY < 0 || tileY > (gameobjects[0].diameter - Math.abs(gameobjects[0].radius - tileX))){
        return false;
    }
    return true;
}
function getMovementDirection(hexCoordinates){
    const xDiff = hexCoordinates[0] - clickedTile.x;
    const yDiff = hexCoordinates[1] - clickedTile.y;
    if (yDiff == 0 || xDiff == 0 || Math.abs(yDiff) == Math.abs(xDiff)) {
        return [xDiff, yDiff];
    }
    return null;
}

function trainArmy(){
    if (clickedTile instanceof Castle && !clickedTile.armyTrained && clickedTile.player.gold >= 4) {
        clickedTile.armyTrained = true;
        clickedTile.player.armies.push(new Army(clickedTile.x, clickedTile.y, clickedTile.player));
        clickedTile.player.gold -= 4;
    }
}
function placeCamp(){
    if (clickedTile != null && (clickedTile.empty || clickedTile instanceof Forest)) {
        gameobjects[0].matrix[clickedTile.x][clickedTile.y] = new Camp(clickedTile.x, clickedTile.y);
    }
}
function moveArmy(hexCoordinates){
    let movedArmy;
    if(moved && clickedTile instanceof Castle && clickedTile.armyTrained){
        const direction = getMovementDirection(hexCoordinates);
        if (direction != null) {
            clickedTile.player.armies.forEach(army => {
                if (army.x == clickedTile.x && army.y == clickedTile.y) {
                    movedArmy = army;
                }
            });
            clickedTile.armyTrained = false;
            for (let i = 0; i < 6; i++) {
                if (tileIsOnTheMap(movedArmy.x + direction[0], movedArmy.y + direction[1])) {
                    if (gameobjects[0].matrix[movedArmy.x][movedArmy.y] instanceof Mountain) {
                        break;
                    }
                    movedArmy.x += direction[0];
                    movedArmy.y += direction[1];
                    // gameobjects[0].matrix[movedArmy.x][movedArmy.y].player = clickedTile.player;
                }
                else{
                    break;
                }
            }
        }
    }
    canvas.removeEventListener("mousemove", moveListener);
    moved = false;
}

canvas.addEventListener('mousedown', function(e) {
    canvas.addEventListener("mousemove", moveListener);
    const coordinates = getCursorPosition(canvas, e);
    
    clickedTile = camera.screenToHex(coordinates[0], coordinates[1], gameobjects[0])[0];
    trainArmy();
    placeCamp();
});
canvas.addEventListener("mouseup", function(e){
    const coordinates = getCursorPosition(canvas, e);
    const tile = camera.screenToHex(coordinates[0], coordinates[1], gameobjects[0])[0];
    const hexCoordinates = [tile.x, tile.y];
    moveArmy(hexCoordinates);
});


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