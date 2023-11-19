import { Hex } from "./hex.js";

export class Village extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Village.svg"
        this.player = null;
        this.level = 1;
    }

    upgrade(){
        if (this.level < 5) {
            this.level ++;
        }
    }
}