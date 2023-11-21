import { Camera } from "./camera.js";
import { darkenColor } from "./engine.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');
export let map = new Map(10, [new Player('#335c67', 0), new Player("#9e2a2b", 1)]);
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
        if(hexCoordinates){
            clickedTile = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
        }
        if (clickedTile && clickedTile.player == map.playerInTurn) {
            map.tileClicked(clickedTile);
        }
    }

    if (input.isKeyReleased("mouseButton0")) {
        let destination;
        if (hexCoordinates) {
            clickedTile = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
        }
        hexCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1]);
        if (hexCoordinates) {
            destination = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
        }
        if (clickedTile && clickedTile.player == map.playerInTurn && destination && clickedTile.player.armyOfTile(clickedTile)) {
            clickedTile.player.armyOfTile(clickedTile).direction = clickedTile.player.armyOfTile(clickedTile).getMovementDirection(destination);
        }
    }

    if (input.isKeyPressed("n")) {
        map.players.forEach(player => {
            player.armies.forEach(army => {
                console.log(army)
                army.moveArmy();
            });
        });
        map.onEndTurn(map.playerInTurn)
        const otherPlayer = map.players.filter((player) => player != map.playerInTurn);
        map.playerInTurn = otherPlayer[0];
        // map.playerInTurn.startTurn();
    }
    camera.update();
    input.update();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);