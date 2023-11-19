let canvas = document.querySelector('#gamecanvas');
export let ctx = canvas.getContext('2d');

let lastTime;
let deltaTime;

function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientWidth);
    ctx.fillStyle = "#3F3F3F";
    ctx.fill();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);