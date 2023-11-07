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
    const x = Math.round(event.clientX - rect.left);                    //screenCoordinates
    const y = Math.round(event.clientY - rect.top);

    const diameter = gameobjects[0].tileSize/Math.cos(Math.PI / 6);     //diameter of one tile in screenCoordinates
    const rowHeight = diameter * 3/4;                                   //hexagon diameter without the quarter at the bottom

    const row1Index = Math.floor(y/rowHeight) - 1;                      //index of the row above the clicked point
    const row2Index = Math.floor(y/rowHeight)                           //index of the row where the clicked point is
    const row1Center = row1Index * rowHeight + diameter/2;              //horizontal center line of the row in screenCoordinates
    const row2Center = row2Index * rowHeight + diameter/2;

    const offset1 = Math.abs(gameobjects[0].radius - 1 - row1Index) * gameobjects[0].tileSize/2 + 278;
    const offset2 = Math.abs(gameobjects[0].radius - 1 - row2Index) * gameobjects[0].tileSize/2 + 278;
    let x1 = x - offset1;
    let x2 = x - offset2;

    const col1Index = Math.floor(x1/gameobjects[0].tileSize);           //index of the column where the clicked x point is in the first row
    const col2Index = Math.floor(x2/gameobjects[0].tileSize);           //index of the column where the clicked x point is in the second row
    const col1Center = col1Index * gameobjects[0].tileSize + gameobjects[0].tileSize/2 + offset1;   //vertical center line of the first column 
    const col2Center = col2Index * gameobjects[0].tileSize + gameobjects[0].tileSize/2 + offset2;

    const xDistance1 = Math.abs(x - col1Center);                        //distance between the clicked point and the vertical center of the first tile
    const xDistance2 = Math.abs(x - col2Center);
    const yDistance1 = Math.abs(y - row1Center);                        //distance between the clicked point and the horizontal center of the first tile
    const yDistance2 = Math.abs(y - row2Center);
    const distance1 = xDistance1 + yDistance1;                          //total distance between the clicked point and the center point of the first tile
    const distance2 = xDistance2 + yDistance2;
    
    let final;
    if (distance1 > distance2) {
        console.log(gameobjects[0].matrix[row2Index][col2Index]);
        final = gameobjects[0].matrix[row2Index][col2Index];
    }
    else{
        console.log(gameobjects[0].matrix[row1Index][col2Index]);
        final = gameobjects[0].matrix[row1Index][col2Index];
    }

    console.log(final.x + " " + final.y)
    if (final.x == gameobjects[0].players[0].baseX && final.y == gameobjects[0].players[0].baseY) {
        console.log(gameobjects[0].matrix[gameobjects[0].players[0].baseX][gameobjects[0].players[0].baseY]);
        gameobjects[0].matrix[gameobjects[0].players[0].baseX][gameobjects[0].players[0].baseY].trainArmy(ctx, camera, gameobjects[0]);
    }
}
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
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