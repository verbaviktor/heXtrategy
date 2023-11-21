import { lerpVector } from "../engine.js";
import { camera, ctx, deltaTime, map } from "../script.js";
import { Camp } from "./camp.js";
import { Forest } from "./forest.js";
import { Tower } from "./tower.js";
import { Village } from "./village.js";

export class Army {
    constructor(x, y, player) {
        this.player = player;
        this.renderedX = x;
        this.renderedY = y;
        this.targetX = x;
        this.targetY = y;
        this.direction;
        this.connectionIndex;
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

    removeArmy(){
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
            let connection = [];
            if (map.getTileAt(this.targetX + this.direction[0], this.targetY + this.direction[1])) {
                this.targetX += this.direction[0];
                this.targetY += this.direction[1];
                currentTile = map.getTileAt(this.targetX, this.targetY);
            }
            
            if (this.connectionIndex == null) {
                this.connectionIndex = this.player.connections.length;
                connection[0] = currentTile;
            }

            if (currentTile.player && currentTile.player != this.player) {
                if (currentTile instanceof Camp) {
                    currentTile = currentTile.damage();
                }
                else {
                    currentTile.player.breakConnections(currentTile);
                }
                currentTile.player = this.player;
                connection.push(currentTile);
            }
            else {
                if (currentTile instanceof Camp) {
                    if (currentTile.hp < currentTile.maxHp) {
                        currentTile.heal();
                        this.removeArmy();
                    }
                    else {
                        this.direction = null;
                        this.stepsMade = 0;
                    }
                }
                else {
                    currentTile.player = this.player;
                    connection.push(currentTile);
                }
            }
            
            if (currentTile.player != this.player) {
                this.removeArmy();
            }
            if (currentTile instanceof Village) {
                currentTile.player.villages.push(currentTile);
            }
            if(currentTile instanceof Tower && currentTile.player != this.player) {
                this.removeArmy();
            }
            if (currentTile instanceof Forest) {
                currentTile.player = this.player;
                currentTile = currentTile.reset();
                connection.push(currentTile);
                this.removeArmy();
            }
            console.log(connection)
            console.log(this.connectionIndex)
            this.player.newConnection(connection, this.connectionIndex);
            this.stepsMade++;
        }
        else if(this.stepsMade >= 6){
            this.removeArmy();
        }
    }
}