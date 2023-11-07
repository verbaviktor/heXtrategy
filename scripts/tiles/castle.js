import { Hex } from "./hex.js";

export class Castle extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
        this.empty = false;
        this.armyTrained = false;
    }

    trainArmy(ctx, camera, map){
        this.armyTrained = true;
        const screenCoordinates = camera.hexToScreen(this.x, this.y, map.mapRadius);
        ctx.drawImage("../resources/ArmyBanner.svg", screenCoordinates[0], screenCoordinates[1], map.tileSize / Math.cos(Math.PI / 6), map.tileSize / Math.cos(Math.PI / 6));
    }
}