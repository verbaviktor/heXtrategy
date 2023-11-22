import { Hex } from "./hex.js";
import { actions, map } from "../script.js";
import { Action, ActionType } from "../action.js";

export class Camp extends Hex {
    constructor(x, y, player) {
        super(x, y);
        this.img.src = "../resources/Camp.svg";
        this.player = player;
        this.upgradeCost *= (this.player.numberOfTowers + 1);
        this.maxHp = 1;
        this.hp = this.maxHp;
    }

    upgrade(tower) {
        if (this.player.gold >= this.upgradeCost) {
            this.player.numberOfTowers++;
            map.placeTile(tower);
            this.player.gold -= this.upgradeCost;
        }
        if (map.playerInTurn == this.player) {
            actions.push(new Action(this.x, this.y, ActionType.BUILDCASTLE));
        }
    }

    damage() {
        this.hp--;
        if (this.hp > 0) {
            return this;
        }
        else {
            if (this.construcor.name == "Camp") {
                this.player.numberOfCamps--;
            }
            else if (this.construcor.name == "Tower") {
                this.player.numberOfTowers--;
            }
            else if (this.construcor.name == "Castle") {
                this.player.numberOfCastles--;
            }

            const newHex = this.reset();
            const otherPlayer = map.players.filter((player) => player != this.player);
            newHex.player = otherPlayer[0];
            return newHex;
        }
    }

    onArmyMove(army) {
        if (army.player == this.player) {
            army.direction = null;
            army.stepsMade = 0;
        }
        else {
            let damagedCamp = this.damage();
            map.placeTile(damagedCamp);
            if (damagedCamp instanceof Camp) {
                army.removeArmy();
            }
            else {
                damagedCamp.player = army.player;
            }
        }
    }
}