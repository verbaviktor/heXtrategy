import { Action } from "./action.js";
import { Camera } from "./camera.js";
import { darkenColor } from "./engine.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js";
import { Player } from "./player.js";
import { Camp } from "./tiles/camp.js";
import { updateStats } from "./updateHTML.js";

document.addEventListener('startRender', (event) => startRender(event.detail))
document.addEventListener('stopRender', () => stopRender())
document.addEventListener('enemyChanged', () => setEnemyColor())
document.addEventListener('startGame', () => startGame())
document.addEventListener('stopGame', () => stopGame())
document.addEventListener('yourTurn', (event) => startTurn(event.detail))
document.addEventListener('endTurn', async () => await endturn())

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
export var actions = [];
export let hoveredTileCoordinates;
var lastTime = 0;
export let deltaTime = 0;
let hexCoordinates;
let clickedTile;
let startCamera;

function startRender(lobbyId) {
    map = new Map(12, [new Player('#335c67'), new Player("#9e2a2b")], lobbyId)
    console.log(map.players, playerIndex)
    map.players[playerIndex].color = '#' + playerColor
    map.players[1 - playerIndex].color = '#' + enemyColor
    camera = new Camera()
    startCamera = camera
    requestAnimationFrame(gameLoop);
    run = true
}

function stopRender() {
    run = false
}

function startGame() {
    console.log("Lobby started")
    console.log(playerIndex)
    map.players[playerIndex].color = '#' + playerColor
    map.players[1 - playerIndex].color = '#' + enemyColor
    recieveInput = true
    camera.targetTileSize = 100
    camera.tileSize = 100
    camera.setHexCoordinates(0, map.radius - 1)
}

function setEnemyColor() {
    console.log(playerIndex)
    map.players[playerIndex].color = '#' + playerColor
    map.players[1 - playerIndex].color = '#' + enemyColor
}

function stopGame() {
    recieveInput = false
    camera = startCamera
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
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    if (recieveInput) {
        ctx.fillStyle = darkenColor("#" + playerColor, 0.7);
    }
    ctx.fill();
    map.render();
    updateStats();
    hoveredTileCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1])

    if (input.isKeyPressed("mouseButton0")) {
        hexCoordinates = camera.screenToHex(input.mousePosition[0], input.mousePosition[1]);
        if (hexCoordinates) {
            clickedTile = map.getTileAt(hexCoordinates[0], hexCoordinates[1]);
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
        if (map.playerInTurn.color == '#' + playerColor) {
            if (clickedTile && clickedTile.player == map.playerInTurn && destination && clickedTile.player.armyOfTile(clickedTile) && clickedTile instanceof Camp) {
                clickedTile.player.armyOfTile(clickedTile).direction = clickedTile.player.armyOfTile(clickedTile).getMovementDirection(destination);
            }
            if (clickedTile && clickedTile.player == map.playerInTurn) {
                map.tileClicked(clickedTile);
            }
        }
    }

    camera.update();
    if (recieveInput) {
        input.update();
    }
    requestAnimationFrame(gameLoop);
}

function startTurn(actions) {
    console.log("It's your turn!")

    if (actions) {
        const parsedActions = []
        for (const action of actions.actions) {
            const parsedAction = new Action(action.x, action.y, action.type, [action.destX, action.destY])
            parsedActions.push(parsedAction)
        }
        console.log(parsedActions)
        for (const action of parsedActions) {
            console.log(action)
            action.execute();
        }
    }

    map.onEndTurn(map.playerInTurn)
    const otherPlayer = map.players.filter((player) => player.color == '#' + playerColor);
    map.playerInTurn = otherPlayer[0];
}

async function endturn() {
    if (map.playerInTurn.color == '#' + playerColor) {
        console.log("Ending turn")
        console.log(actions)
        await postRequest('game/endturn', actions)
        map.onEndTurn(map.playerInTurn)
        const otherPlayer = map.players.filter((player) => player.color == '#' + enemyColor);
        map.playerInTurn = otherPlayer[0];
        fetchingGame = true
        actions = []
    }
    else {
        console.log('It is not your turn!')
    }
}