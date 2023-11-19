import { Hex } from "./hex.js";
import { map } from "../script.js";

export class Camp extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Camp.svg";
        this.player = player;
        this.armyTrained = false;
        this.upgradeCost *= (this.player.numberOfTowers + 1);
        this.maxHp = 1;
        this.hp = this.maxHp;
    }
    
    upgrade(tower){
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfTowers ++;
            map.placeTile(tower);
            this.player.gold -= this.upgradeCost;
        }
    }

    damage(){
        this.hp--;
        if (this.hp > 0) {
            return this;
        }
        else{
            const newHex = this.reset();
            const otherPlayer = map.players.filter((player) => player != this.player);
            this.player.breakConnections(this);
            newHex.player = otherPlayer[0];
            return newHex;
        }
    }
}