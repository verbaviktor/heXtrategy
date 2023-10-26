import { Hex } from "./hex.js";

export class Forest extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Forest.svg"
        this.empty = false;
    }
}