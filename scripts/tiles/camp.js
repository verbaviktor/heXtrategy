import { Hex } from "./hex.js";

export class Camp extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Camp.svg"
        this.upgradeCost = 4;
        this.empty = false;
    }

    upgrade(numberOfTowers){

    }
}