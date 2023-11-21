import { Castle } from "./castle.js";

export class Base extends Castle{
    constructor(x, y, player){
        super(x, y, player);
        this.img.src = "../resources/Castle.svg";

        if (this.hp == 0) {
            const otherPlayer = map.players.filter((player) => player != this.player);
            otherPlayer[0].getArmyOfTile(this).removeArmy();
            this.player.endGame();
        }
    }
}