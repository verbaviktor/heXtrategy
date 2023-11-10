import { Hex } from "./hex.js";

export class Village extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Village.svg"
        this.empty = false;
        this.player = null;
    }

    generateGold(){
        setInterval( function() {
            this.player.gold += 4;
        }, 1000);
    }
}