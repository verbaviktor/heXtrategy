import { Castle } from "./castle.js";

export class Base extends Castle{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";

        if (this.hp == 0) {
            this.player.endGame();
        }
    }
}