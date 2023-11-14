import { Camp } from "./camp.js";
import { Castle } from "./castle.js";

export class Tower extends Camp{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Tower.svg";
        this.upgradeCost = (this.player.numberOfCastles + 1) * 12; 
    }

    upgrade(map, castle){
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfCastles ++;
            map.matrix[this.x][this.y] = castle;
            this.player.gold -= this.upgradeCost;
        }
    }
}