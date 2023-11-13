import { Hex } from "./hex.js";

export class Forest extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Forest.svg"
    }

    placeCamp(map, camp){
        if (this.player.gold >= 2) {
            this.player.gold -= 2;
            map.matrix[this.y][this.x] = camp;
        }
    }
}