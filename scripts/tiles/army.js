import { Action, ActionType } from "../action.js";
import { darkenColor, lerpVector } from "../engine.js";
import { actions, camera, ctx, deltaTime, map } from "../script.js";

export class Army {
    constructor(x, y, player) {
        this.player = player;
        this.renderedX = x;
        this.renderedY = y;
        this.targetX = x;
        this.targetY = y;
        this.direction;
        this.stepsMade = 0;
        this.createAction = false;
        let img = new Image();
        img.src = "../resources/ArmyBanner.svg";
        this.img = img;
    }

    render() {
        const lerpedPosition = lerpVector([this.renderedX, this.renderedY], [this.targetX, this.targetY], 35 * deltaTime);
        this.renderedX = lerpedPosition[0];
        this.renderedY = lerpedPosition[1];
        const tileCenter = camera.hexToScreen(this.renderedX, this.renderedY);
        ctx.drawImage(this.img, tileCenter[0] - camera.tileSize / 2, tileCenter[1] - camera.tileSize / 2, camera.tileSize, camera.tileSize);
        if (this.direction) {
            ctx.globalAlpha = 0.75
            ctx.beginPath()
            ctx.moveTo(tileCenter[0], tileCenter[1])
            const directionTileCenter = camera.hexToScreen(this.targetX + this.direction[0], this.targetY + this.direction[1]);
            ctx.lineTo(directionTileCenter[0], directionTileCenter[1])
            ctx.strokeStyle = darkenColor(this.player.color, 0.75)
            ctx.lineWidth = 7
            ctx.stroke()
            ctx.globalAlpha = 1
        }
    }

    removeArmy() {
        this.player.armies = this.player.armies.filter((army) => army != this);
    }

    getMovementDirection(destination) {
        const xDiff = destination.x - this.targetX;
        const yDiff = destination.y - this.targetY;
        if (xDiff == 0 && yDiff == 0) {
            return null;
        }
        if (yDiff == 0 || xDiff == 0 || yDiff == xDiff * -1) {
            actions.push(new Action(this.targetX, this.targetY, ActionType.MOVEARMY, [Math.sign(xDiff), Math.sign(yDiff)]));
            return [Math.sign(xDiff), Math.sign(yDiff)];
        }
        return null;
    }

    moveArmy() {
        let currentTile;
        if (this.stepsMade < 6 && this.direction) {
            currentTile = null;
            const nextTile = map.getTileAt(this.targetX + this.direction[0], this.targetY + this.direction[1]);
            if (nextTile) {
                if (map.players[1 - playerIndex].armyOfTile(nextTile)) {
                    map.players[1 - playerIndex].armyOfTile(nextTile).removeArmy();
                    this.removeArmy();
                }
                this.targetX += this.direction[0];
                this.targetY += this.direction[1];
                this.stepsMade++;
                currentTile = map.getTileAt(this.targetX, this.targetY);
                currentTile.onArmyMove(this);
                currentTile = map.getTileAt(this.targetX, this.targetY);

                if (map.playerInTurn == this.player) {
                    this.createAction = true;
                }
            }
            else {
                this.removeArmy();
                return
            }
        }
        else if (this.stepsMade >= 6) {
            this.removeArmy();
        }
    }
    onEndTurn(player) {
        this.moveArmy()
    }
}