import { Castle } from "./castle.js";

export class Base extends Castle{
    constructor(x, y, player){
        super(x, y);
        this.img.src = "../resources/Castle.svg"
        this.player = player;
    }
}