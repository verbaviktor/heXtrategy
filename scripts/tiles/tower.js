import { Camp } from "./camp.js";
import { map } from "../script.js";

export class Tower extends Camp{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Tower.svg";
        this.upgradeCost *= 3*(this.player.numberOfCastles + 1); 
        this.maxHp = 2;
        this.hp = this.maxHp;
    }

    upgrade(castle){
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfCastles ++;
            map.placeTile(castle);
            this.player.gold -= this.upgradeCost;
            this.player.numberOfTowers--;
        }
        if (map.playerInTurn == this.player) {
            this.createAction = true;
        }
    }

    heal(){
        this.hp++;
    }
}