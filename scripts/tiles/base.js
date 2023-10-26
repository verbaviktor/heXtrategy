import { Hex } from "./hex.js";

export class Base extends Hex{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
        this.player = player;
        player.base = this;
    }
}