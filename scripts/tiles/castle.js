import { Tower } from "./tower.js";
import { Army } from "./army.js";

export class Castle extends Tower{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";
        this.armyTrained = false;
        this.armyCost = 2;
        this.hp = 3;
    }

    trainArmy(){
        if (!this.armyTrained && this.player.gold >= this.armyCost) {
            this.armyTrained = true;
            this.player.gold -= this.armyCost;
            this.player.armies.push(new Army(this.x, this.y, this.player));
        }
    }
}