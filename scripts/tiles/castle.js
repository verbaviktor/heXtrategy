import { Tower } from "./tower.js";
import { Army } from "./army.js";

export class Castle extends Tower{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";
        this.armyTrained = false;
    }

    trainArmy(){
        if (!this.armyTrained && this.player.gold >= 4) {
            this.armyTrained = true;
            this.player.gold -= 4;
            this.player.armies.push(new Army(this.x, this.y, this.player));
        }
    }
}