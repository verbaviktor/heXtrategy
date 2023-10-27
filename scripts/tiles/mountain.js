import { Hex } from "./hex.js";

export class Mountain extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Mountain.svg"
        this.empty = false;
    }
}