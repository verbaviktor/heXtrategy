import { camera, ctx } from "../script.js";

export class Army {
    constructor(x, y, player) {
        this.player = player;
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/ArmyBanner.svg";
        this.img = img;
    }

    render() {
        const tileCenter = camera.hexToScreen(this.x, this.y);
        ctx.drawImage(this.img, tileCenter[0] - camera.tileSize / 2, tileCenter[1] - camera.tileSize / 2, camera.tileSize, camera.tileSize)
    }
}