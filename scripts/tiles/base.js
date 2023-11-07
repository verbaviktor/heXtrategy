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
        const screenCoordinates = camera.screenToHex(this.x, this.y, map.mapRadius);    //not the correct coordinates 
        console.log(this.x, this.y)
        ctx.drawImage(this.bannerImage, this.x, this.y, map.tileSize / Math.cos(Math.PI / 6), map.tileSize / Math.cos(Math.PI / 6));
    }
}