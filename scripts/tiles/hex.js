import { darkenColor, lerpColor } from "../engine.js";
import { camera, ctx, deltaTime, map } from "../script.js";

export class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        const img = new Image();
        this.img = img;
        this.player = null;
        this.color = '#F0F0F0'
        this.targetColor = '#F0F0F0'
        this.upgradeCost = 2;
    }

    placeCamp(camp) {
        if (this.player.gold >= this.upgradeCost) {
            this.player.gold -= this.upgradeCost;
            map.placeTile(camp);
            this.player.updateConnections(camp);
        }
    }

    reset() {
        const hex = new Hex(this.x, this.y);
        hex.player = this.player;
        map.placeTile(hex);
        return hex;
    }

    onArmyMove(army){
        if (this.player && this.player != army.player) {
            this.player.breakConnections(this);
            this.player = army.player;
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

        let gradient = ctx.createLinearGradient( //Gradient going from bottomright corner to topleft
            hexagonCenter[0] - camera.tileSize / 2,
            hexagonCenter[1] - camera.tileSize / 2,
            hexagonCenter[0] + camera.tileSize / 2,
            hexagonCenter[1] + camera.tileSize / 2
        )
        if (this.player) {
            this.targetColor = this.player.color
        }
        else {
            this.targetColor = '#F0F0F0'
        }
        this.color = lerpColor(this.color, this.targetColor, 35 * deltaTime)
        gradient.addColorStop(0.5, this.color)
        gradient.addColorStop(1, darkenColor(this.color, 0.75))
        ctx.fillStyle = gradient
        ctx.fill()

        if (this.img.src) {
            ctx.drawImage(this.img, hexagonCenter[0] - camera.tileSize / 2, hexagonCenter[1] - camera.tileSize / 2, camera.tileSize, camera.tileSize);
        }
    }

    onArmyMove(army) {
        this.player = army.player
    }

    onEndTurn(player) {

    }
}