import { Hex } from "./tiles/hex.js";
import { Base } from "./tiles/base.js";
import { Forest } from "./tiles/forest.js";
import { Mountain } from "./tiles/mountain.js";
import { Village } from "./tiles/village.js";
import { camera, ctx } from "./script.js"
import { Castle } from "./tiles/castle.js";
import { Camp } from "./tiles/camp.js";

export class Map {
    constructor(radius, players) {
        this.radius = radius;
        this.diameter = (radius * 2) - 1;
        this.matrix = [];
        this.players = players;
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
        console.log(this.matrix)
        this.placeBases();
        this.generateTerrain();
    }
    render() {
        for (const row of this.matrix) {
            for (const hex of row) {
                const screen_coordinates = camera.hexToScreen(hex.x, hex.y);
                ctx.drawImage(hex.img, screen_coordinates[0] - camera.tileSize / 2, screen_coordinates[1] - camera.tileSize / 2, camera.tileSize, camera.tileSize);
            }

        }
        let tileCenter;
        this.players.forEach(player => {
            player.armies.forEach(army => {
                tileCenter = camera.hexToScreen(army.x, army.y);
                ctx.drawImage(army.img, tileCenter[0] - 30, tileCenter[1] - 90, camera.tileSize * 1.2, camera.tileSize * 2.5)
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
    generateTerrain() {
        const forest_density = 0.15
        const mountain_density = 0.1
        const village_density = 0.03
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
            tile.trainArmy();
        }
        else if (tile.constructor.name == "Hex" || tile.constructor.name == "Forest") {
            tile.placeCamp(this, new Camp(tile.x, tile.y, tile.player));
        }
    }

    getMovementDirection(start, destination) {
        const xDiff = Math.sign(destination.x - start.x);
        const yDiff = Math.sign(destination.y - start.y);
        if (xDiff == 0 && yDiff == 0) {
            return null;
        }
        if (yDiff == 0 || xDiff == 0 || Math.abs(yDiff) == Math.abs(xDiff)) {
            return [xDiff, yDiff];
        }
        return null;
    }
    moveArmy(start, destination) {
        const direction = this.getMovementDirection(start, destination);
        let movedArmy;
        start.player.armies.forEach(army => {
            if (army.x == start.x && army.y == start.y) {
                movedArmy = army;
            }
        });

        if (movedArmy && direction) {
            for (let i = 0; i < 6; i++) {
                if (this.getTileAt(movedArmy.x + direction[0], movedArmy.y + direction[1])) {
                    if (this.getTileAt(movedArmy.x, movedArmy.y) instanceof Mountain) {
                        break;
                    }
                    else if (this.getTileAt(movedArmy.x, movedArmy.y) instanceof Forest) {
                        const hex = new Hex(movedArmy.x, movedArmy.y);
                        hex.player = movedArmy.player;
                        this.placeTile(hex);
                        break;
                    }
                    movedArmy.x += direction[0];
                    movedArmy.y += direction[1];
                    this.getTileAt(movedArmy.x, movedArmy.y).player = movedArmy.player;
                }
                else {
                    break;
                }
            }
            if (start instanceof Castle) {
                start.armyTrained = false;
            }
        }
        return false;
    }

}