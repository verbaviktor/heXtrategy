import { Hex } from "./hex.js";
import { map } from "../script.js";

export class Camp extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Camp.svg";
        this.player = player;
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
            newHex.player = otherPlayer[0];
            return newHex;
        }
    }
    
    onArmyMove(army){
        if (army.player == this.player) {
            army.direction = null;
            army.stepsMade = 0;
        }
        else{
            let damagedCamp = this.damage();
            map.placeTile(damagedCamp);
            if (damagedCamp instanceof Camp) {
                army.removeArmy();
            }
            else{
                console.log(damagedCamp)
                damagedCamp.player = army.player;
            }
        }
    }
}