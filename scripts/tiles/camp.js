import { Hex } from "./hex.js";
import { map } from "../script.js";

export class Camp extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Camp.svg";
        this.player = player;
        this.upgradeCost *= (this.player.numberOfTowers + 1);
        this.hp = 1;
    }
    
    upgrade(tower){
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfTowers ++;
            map.placeTile(tower);
            this.player.gold -= this.upgradeCost;
        }
    }

    damage(){
        if (this.hp > 0) {
            this.hp--;
        }
        else{
            this.reset(this);
        }
    }
}