import { Camera } from "./camera.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js";
import { Player } from "./player.js";

document.addEventListener('startRender', (event) => startRender(event.detail))
document.addEventListener('stopRender', () => stopRender())
document.addEventListener('startGame', () => startGame())

let run = false
export var recieveInput = false

export let canvas = document.querySelector('#gamecanvas');
const canvasStyle = window.getComputedStyle(canvas);
canvas.width = parseFloat(canvasStyle.width.slice(0, canvasStyle.width.length - 2))
canvas.height = parseFloat(canvasStyle.height.slice(0, canvasStyle.width.length - 2))
export let ctx = canvas.getContext('2d');
export let map;
export let camera;
export let input = new InputHandler();
export let actions = [];
export let hoveredTileCoordinates;
var lastTime = 0;
export let deltaTime = 0;
let hexCoordinates;
let clickedTile;

function startRender(lobbyId) {
    map = new Map(12, [new Player('#335c67'), new Player("#9e2a2b")], lobbyId)
    camera = new Camera()
    requestAnimationFrame(gameLoop);
    run = true
}

function stopRender() {
    run = false
}

function startGame() {
    console.log(playerColor)
    console.log(enemyColor)
    map.players[0].color = '#' + playerColor
    map.players[1].color = '#' + enemyColor
    recieveInput = true
}

function gameLoop(timestamp) {
    if (!run) {
        return
    }
    const canvasStyle = window.getComputedStyle(canvas);
    canvas.width = parseFloat(canvasStyle.width.slice(0, canvasStyle.width.length - 2))
    canvas.height = parseFloat(canvasStyle.height.slice(0, canvasStyle.width.length - 2))

    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "#1a1a1a";
    // ctx.fill();
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
        if (clickedTile && clickedTile.player == map.playerInTurn && destination && clickedTile.player.armyOfTile(clickedTile)) {
            clickedTile.player.armyOfTile(clickedTile).direction = clickedTile.player.armyOfTile(clickedTile).getMovementDirection(destination);
        }
    }

    if (input.isKeyPressed("n")) {
        map.onEndTurn(map.playerInTurn)
        const otherPlayer = map.players.filter((player) => player != map.playerInTurn);
        map.playerInTurn = otherPlayer[0];
        // map.playerInTurn.startTurn();
    }
    camera.update();
    if (recieveInput) {
        input.update();
    }
    requestAnimationFrame(gameLoop);
}