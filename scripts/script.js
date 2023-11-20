import { Camera } from "./camera.js";
import { darkenColor, vhToPixels } from "./engine.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

document.addEventListener('startGame', () => startGame())

let canvas = document.querySelector('#gamecanvas');
const canvasStyle = window.getComputedStyle(canvas);
canvas.width = parseFloat(canvasStyle.width.slice(0, canvasStyle.width.length - 2))
canvas.height = parseFloat(canvasStyle.height.slice(0, canvasStyle.width.length - 2))
export let ctx = canvas.getContext('2d');
export let map = new Map(12, [new Player('#335c67'), new Player("#9e2a2b")]);
export let camera = new Camera();
export let input = new InputHandler();
export let hoveredTileCoordinates;
var lastTime = 0;
export let deltaTime = 0;
let hexCoordinates;
let clickedTile;

function startGame(lobbyId) {
    camera = new Camera()
    map = new Map(12, [new Player('#335c67'), new Player("#9e2a2b")], lobbyId)
}

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fill();
    map.render();
    hoveredTileCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1])

    if (input.isKeyPressed("mouseButton0")) {
        hexCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1]);
        if (hexCoordinates) {
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
        if (clickedTile && clickedTile.player == map.playerInTurn && destination) {
            map.moveArmy(clickedTile, destination);
        }
    }

    if (input.isKeyPressed("n")) {
        const otherPlayer = map.players.filter((player) => player != map.playerInTurn);
        map.playerInTurn = otherPlayer[0];
        map.playerInTurn.startTurn();
    }
    camera.update();
    input.update();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);