import { Hex } from "./hex.js";

export class Forest extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Forest.svg"
    }

    onArmyMove(army){
            let newHex = this.reset();
            newHex.player = army.player;
            army.direction = null;
            army.stepsMade = 0;
            army.removeArmy();
    }
}