import { Camp } from "./camp.js";

export class Camp extends Camp{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Tower.svg"
        this.empty = false;
        this.upgradeCost = 12; 
    }

    upgrade(numberOfCastles){

    }
}