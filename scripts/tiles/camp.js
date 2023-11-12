import { Hex } from "./hex.js";

export class Camp extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Camp.svg";
        this.empty = false;
        this.player = player;
        this.upgradeCost = (this.player.numberOfTowers + 1) * 4;
    }
    
    upgrade(map, tower){
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfTowers ++;
            map.matrix[this.x][this.y] = tower;
            this.player.gold -= this.upgradeCost;
        }
    }
}