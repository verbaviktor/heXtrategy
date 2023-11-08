import { Camera } from "./camera.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

let canvas = document.querySelector('#gamecanvas');
var ctx = canvas.getContext('2d');
var gameobjects = [];
gameobjects.push(new Map(10, [new Player(), new Player()]));
let camera = new Camera();

var lastTime = 0;
var deltaTime = 0;

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);
    return [x, y];
}
canvas.addEventListener('mousedown', function(e) {
    const coordinates = getCursorPosition(canvas, e)
    
    const tile = camera.screenToHex(coordinates[0], coordinates[1], gameobjects[0])[0];
    console.log(tile.x + " " + tile.y)
    const centerpoint = camera.screenToHex(coordinates[0], coordinates[1], gameobjects[0])[1];
    console.log(centerpoint.x, centerpoint.y)
    // if (tile.x == gameobjects[0].players[0].baseX && tile.y == gameobjects[0].players[0].baseY) {
    //     console.log(gameobjects[0].matrix[gameobjects[0].players[0].baseX][gameobjects[0].players[0].baseY]);
    //     console.log(coordinates[0], coordinates[1]);
    //     console.log(camera.hexToScreen[3, 6])
    //     gameobjects[0].matrix[gameobjects[0].players[0].baseX][gameobjects[0].players[0].baseY].trainArmy(ctx, camera, gameobjects[0]);
    // }
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