import { Hex } from "./hex.js";

export class Castle extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
        this.empty = false;
        this.armyTrained = false;
        let bannerImage = new Image();
        bannerImage.src = "../resources/ArmyBanner.svg";
        this.bannerImage = bannerImage;
    }

    
    trainArmy(map, ctx, centerpoint) {
        this.armyTrained = true;
        ctx.drawImage(this.bannerImage, centerpoint[0] - map.tileSize*0.05, centerpoint[1] - map.tileSize*1.4, map.tileSize*1.2, map.tileSize*2.5);
    }
}