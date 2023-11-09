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
}