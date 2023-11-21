import { Hex } from "./hex.js";

export class Village extends Hex {
    constructor(x, y) {
        super(x, y);
        this.img.src = "../resources/Village1.svg"
        this.player = null;
        this.level = 1;
        this.turnsSinceLastUpgrade = 0
    }

    upgrade() {
        if (this.level < 5) {
            this.level++;
            this.img.src = `../resources/Village${this.level}.svg`
        }
    }

    onArmyMove(army) {
        if (this.player && this.player != army.player) {
            this.player = army.player
            this.level = 1
            this.img.src = `../resources/Village1.svg`
            this.turnsSinceLastUpgrade = 0
        }
        else {
            this.player = army.player
        }
    }

    onEndTurn(player) {
        if (player == this.player) {
            this.turnsSinceLastUpgrade += 1
            if (this.turnsSinceLastUpgrade >= 2) {
                this.upgrade()
                this.turnsSinceLastUpgrade = 0
            }
            this.player.gold += this.level
        }
    }
}