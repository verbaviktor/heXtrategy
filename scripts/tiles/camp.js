import { Hex } from "./hex.js";
import { map } from "../script.js";

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
            this.player.numberOfCamps--;
        }
        if (map.playerInTurn == this.player) {
            this.createAction = true;
        }
    }

    damage() {
        this.hp--;
        if (this.hp > 0) {
            return this;
        }
        else {
            if (this.constructor.name == "Camp") {
                this.player.numberOfCamps--;
            }
            else if (this.constructor.name == "Tower") {
                this.player.numberOfTowers--;
            }
            else if (this.constructor.name == "Castle") {
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