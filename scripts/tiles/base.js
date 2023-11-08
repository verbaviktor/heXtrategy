import { Hex } from "./hex.js";

export class Base extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
        this.player = player;
        this.empty = false;
        this.armyTrained = false;
        let bannerImage = new Image();
        bannerImage.src = "../resources/ArmyBanner.svg";
        this.bannerImage = bannerImage;
    }

    trainArmy(ctx, camera, map){
        this.armyTrained = true;
        const screenCoordinates = camera.hexToScreen(this.x, this.y, map.mapRadius);    //not the correct coordinates 
        console.log(screenCoordinates[0], screenCoordinates[1])
        ctx.drawImage(this.bannerImage, this.x, this.y, map.tileSize / Math.cos(Math.PI / 6), map.tileSize / Math.cos(Math.PI / 6));
    }
}