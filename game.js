let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');

let lastTime;
let deltaTime;

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    console.log(1 / deltaTime)
    ctx.clearRect(0, 0, 2000, 2000);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);