import { darkenColor } from "../color.js";
import { camera, ctx } from "../script.js";

export class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/Hex.svg";
        this.img = img;
        this.player = null;
    }

    placeCamp(map, camp) {
        if (this.player.gold >= 4) {
            this.player.gold -= 4;
            map.placeTile(camp);
        }
    }

    render() {
        ctx.beginPath()

        const hexagonRadius = camera.tileSize / 2
        const hexagonCenter = camera.hexToScreen(this.x, this.y)

        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i + Math.PI / 6
            let p1 = hexagonRadius * Math.cos(angle) + hexagonCenter[0];
            let p2 = hexagonRadius * Math.sin(angle) + hexagonCenter[1];
            ctx.lineTo(p1, p2);
        }
        ctx.closePath()
        if (this.player) {
            let gradient = ctx.createLinearGradient(hexagonCenter[0], hexagonCenter[1] - camera.tileSize / 2, hexagonCenter[0], hexagonCenter[1] + camera.tileSize / 2)

            gradient.addColorStop(0, this.player.color)
            gradient.addColorStop(1, darkenColor(this.player.color, 0.5))
            ctx.fillStyle = gradient
            ctx.fill()
        }
        else {
            // ctx.fillStyle = '#F0F0F0'
            // ctx.fillRect(0, 0, 100, 100)
        }
    }
}