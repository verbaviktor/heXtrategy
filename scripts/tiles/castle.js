import { Tower } from "./tower.js";

export class Castle extends Tower{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";
        this.empty = false;
        this.armyTrained = false;
    }
}