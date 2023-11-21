import { Tower } from "./tower.js";
import { Army } from "./army.js";

export class Castle extends Tower{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";
        this.armyCost = 2;
        this.maxHp = 3;
        this.hp = this.maxHp;
    }

    trainArmy(){
        if (this.hp < this.maxHp) {
            this.heal();
        }
        else if (!this.player.armyOfTile(this) && this.player.gold >= this.armyCost) {
            this.armyTrained = true;
            this.player.gold -= this.armyCost;
            this.player.armies.push(new Army(this.x, this.y, this.player));
        }
    }
}