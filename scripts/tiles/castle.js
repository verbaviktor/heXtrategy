import { Hex } from "./hex.js";

export class Castle extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
    }
}