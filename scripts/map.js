import { Hex } from "./tiles/hex.js";
import { Forest } from "./tiles/forest.js";
import { Mountain } from "./tiles/mountain.js";
import { Village } from "./tiles/village.js";
import { Camp } from "./tiles/camp.js";
import { Tower } from "./tiles/tower.js";
import { Castle } from "./tiles/castle.js";
import { Base } from "./tiles/base.js";
import { generateControlledNoise } from "./noise.js";
import { actions } from "./script.js";
import { Action, ActionType } from "./action.js";

export class Map {
    constructor(radius, players, seed) {
        console.log(seed)
        this.seed = seed
        this.radius = radius;
        this.diameter = (radius * 2) - 1;
        this.matrix = [];
        this.players = players;
        this.playerInTurn = players[0];
        this.generateTiles();
    }

    generateTiles() {
        for (let y = 0; y < this.diameter; y++) {
            const hexesInRow = this.diameter - Math.abs(y - this.radius + 1);
            const startIndex = Math.max(-y, -this.radius + 1)
            let row = [];
            for (let x = startIndex; x < hexesInRow + startIndex; x++) {
                row.push(new Hex(x, y));
            }
            this.matrix.push(row);
        }
        this.placeBases();
        this.generateTerrain(this.seed);
    }
    render() {
        for (const row of this.matrix) {
            for (const hex of row) {
                hex.render()
            }

        }
        this.players.forEach(player => {
            player.armies.forEach(army => {
                army.render()
            });
        });
    }
    placeBases() {
        //2.5 value can be changed to bring bases closer or further apart. (Smaller value -> Closer bases)
        let base1Y = Math.floor(this.radius / 2.5)
        if (base1Y % 2 == 0) {
            base1Y -= 1
        }
        let base2Y = this.diameter - base1Y - 1

        const hexesInRow = this.diameter - Math.abs(base1Y - this.radius + 1)
        const startIndex = Math.max(-base1Y, -this.radius + 1)
        let base1X = (hexesInRow - 1) / 2 + startIndex
        let base2X = -base1X
        // let baseX = 0

        const base0 = new Base(base1X, base1Y, this.players[0]);
        const base1 = new Base(base2X, base2Y, this.players[1]);
        this.placeTile(base0);
        this.placeTile(base1);
        this.players[0].base = base0;
        this.players[1].base = base1;
    }
    getTileAt(x, y) {
        try {
            const startIndexInRow = Math.max(-y, -this.radius + 1)
            return this.matrix[y][x - startIndexInRow]
        } catch (error) {
            null
        }
    }
    placeTile(tile) {
        const startIndexInRow = Math.max(-tile.y, -this.radius + 1)
        this.matrix[tile.y][tile.x - startIndexInRow] = tile
    }
    getTilesInRow(y) {
        try {
            return this.matrix[y]
        } catch (error) {
            null
        }
    }
    generateTerrain(seed) {
        const forest_density = 0.15
        const mountain_density = 0.05
        const village_density = 0.03
        const noise = generateControlledNoise(seed, this.diameter)
        for (const row of this.matrix) {
            for (const hex of row) {
                const random = Math.random()
                if (hex instanceof Base) {
                    continue
                }
                if (random < forest_density) {
                    this.placeTile(new Forest(hex.x, hex.y))
                    continue
                }
                if (random < forest_density + mountain_density) {
                    this.placeTile(new Mountain(hex.x, hex.y))
                    continue
                }
                if (random < forest_density + mountain_density + village_density) {
                    this.placeTile(new Village(hex.x, hex.y))
                    continue
                }
            }
        }
    }

    tileClicked(tile) {
        if (tile instanceof Castle) {
            if (tile.trainArmy()) {
                actions.push(new Action(tile.x, tile.y, ActionType.TRAINARMY));
            }
        }
        else if (tile.constructor.name == "Hex") {
            tile.placeCamp(new Camp(tile.x, tile.y, tile.player));
            actions.push(new Action(tile.x, tile.y, ActionType.BUILDCAMP));
        }
        else if (tile.constructor.name == "Camp" && !tile.player.armyOfTile(tile)) {
            tile.upgrade(new Tower(tile.x, tile.y, tile.player));
            actions.push(new Action(tile.x, tile.y, ActionType.BUILDTOWER));
        }
        else if (tile.constructor.name == "Tower" && !tile.player.armyOfTile(tile)) {
            tile.upgrade(new Castle(tile.x, tile.y, tile.player));
            actions.push(new Action(tile.x, tile.y, ActionType.BUILDCASTLE));
        }
    }

    onEndTurn(player) {
        for (const player of this.players) {
            for (const army of player.armies) {
                army.onEndTurn()
            }
        }
        for (const row of this.matrix) {
            for (const hex of row) {
                hex.onEndTurn(player)
            }
        }
    }
}