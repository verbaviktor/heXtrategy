import { lerpVector } from "../engine.js";
import { camera, ctx, deltaTime, map } from "../script.js";

export class Army {
    constructor(x, y, player) {
        this.player = player;
        this.renderedX = x;
        this.renderedY = y;
        this.targetX = x;
        this.targetY = y;
        this.direction;
        this.connection = [];
        this.stepsMade = 0;
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
            return [Math.sign(xDiff), Math.sign(yDiff)];
        }
        return null;
    }

    moveArmy() {
        if (this.stepsMade < 6 && this.direction) {
            let currentTile;
            if (map.getTileAt(this.targetX + this.direction[0], this.targetY + this.direction[1])) {
                this.targetX += this.direction[0];
                this.targetY += this.direction[1];
                currentTile = map.getTileAt(this.targetX, this.targetY);
                currentTile.onArmyMove(this);
                currentTile = map.getTileAt(this.targetX, this.targetY);
                this.stepsMade++;
                
                if (currentTile.player == this.player) {
                    this.connection.push(currentTile);
                }
            }
            else{
                this.endMovement();
                return
            }
        }
        else if (this.stepsMade >= 6) {
            this.endMovement();
        }
    }
    endMovement(){
        this.player.newConnection(this.connection);
        this.removeArmy();
    }
    onEndTurn(player) {
        this.moveArmy()
    }
}