import { Camera } from "./camera.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');
export let map = new Map(10, [new Player('#FF0000'), new Player("#0000FF")]);
export let camera = new Camera();
export let input = new InputHandler();
export let hoveredTileCoordinates;
var lastTime = 0;
export let deltaTime = 0;
let hexCoordinates;
let clickedTile;

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();
    map.render();
    lastTime = timestamp;
    hoveredTileCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1])
    
    if (input.isKeyPressed("mouseButton0")) {
        hexCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1]);
        clickedTile = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
        if (clickedTile.player) {
            map.tileClicked(clickedTile);
        }
    }
    
    if (input.isKeyReleased("mouseButton0")) {
        clickedTile = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
        hexCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1]);
        if (clickedTile.player) {
            map.moveArmy(clickedTile, map.getTileAt(hexCoordinates[0], hexCoordinates[1]));
        }
    }
    input.update();
    camera.update();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);