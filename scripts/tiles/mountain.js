import { Hex } from "./hex.js";

export class Mountain extends Hex{
    constructor(x, y){
        super(x, y);
        this.img.src = "../resources/Mountain.svg"
    }

    onArmyMove(army){
        army.direction = null;
        army.stepsMade = 0;
        army.removeArmy();
    }
}