import { Hex } from "./tiles/hex.js";
import { Forest } from "./tiles/forest.js";
import { Mountain } from "./tiles/mountain.js";
import { Village } from "./tiles/village.js";
import { Camp } from "./tiles/camp.js";
import { Tower } from "./tiles/tower.js";
import { Castle } from "./tiles/castle.js";
import { Base } from "./tiles/base.js";
import { generateControlledNoise } from "./noise.js";

export class Map {
    constructor(radius, players) {
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
        this.generateTerrain("");
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
            const startIndex = Math.max(row[0].y, -this.radius + 1)
            for (const hex of row) {
                const random = noise[hex.x + startIndex][hex.y]
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
        else if (tile.constructor.name == "Hex") {
            tile.placeCamp(new Camp(tile.x, tile.y, tile.player));
        }
        else if (tile.constructor.name == "Camp" && !tile.player.armyOfTile(tile)) {
            tile.upgrade(new Tower(tile.x, tile.y, tile.player));
        }
        else if (tile.constructor.name == "Tower" && !tile.player.armyOfTile(tile)) {
            tile.upgrade(new Castle(tile.x, tile.y, tile.player));
        }
    }

    getMovementDirection(start, destination) {
        const xDiff = destination.x - start.x;
        const yDiff = destination.y - start.y;
        if (xDiff == 0 && yDiff == 0) {
            return null;
        }
        if (yDiff == 0 || xDiff == 0 || yDiff == xDiff * -1) {
            return [Math.sign(xDiff), Math.sign(yDiff)];
        }
        return null;
    }
    moveArmy(start, destination) {
        const direction = this.getMovementDirection(start, destination);
        let movedArmy = start.player.armyOfTile(start);

        if (movedArmy && direction) {
            let currentTile;
            let connection = [start];
            for (let i = 0; i < 6; i++) {
                if (this.getTileAt(movedArmy.targetX + direction[0], movedArmy.targetY + direction[1])) {
                    movedArmy.targetX += direction[0];
                    movedArmy.targetY += direction[1];
                    currentTile = this.getTileAt(movedArmy.targetX, movedArmy.targetY);
                    connection.push(currentTile);
                }

                if (currentTile.player && currentTile.player != movedArmy.player) {
                    if (currentTile instanceof Tower) {
                        currentTile = currentTile.damage();
                        break;
                    }
                    else if (currentTile.constructor.name == "Camp") {
                        currentTile = currentTile.damage();
                    }
                    else {
                        currentTile.player.breakConnections(currentTile);
                    }
                    currentTile.player = movedArmy.player;
                }
                else {
                    if (currentTile instanceof Mountain) {
                        break;
                    }
                    else if (currentTile instanceof Camp) {
                        if (this.hp < this.maxHp) {
                            this.heal();
                        }
                        else {
                            this.armyTrained = true;
                        }
                        break;
                    }
                    else {
                        currentTile.player = movedArmy.player;
                    }
                }

                if (currentTile instanceof Forest) {
                    currentTile = currentTile.reset();
                    break;
                }
                else if (currentTile instanceof Village) {
                    currentTile.player.villages.push(currentTile);
                }
            }
            if (!(currentTile instanceof Camp) || (currentTile instanceof Tower && currentTile.player != movedArmy.player)) {
                movedArmy.player.armies = movedArmy.player.armies.filter((army) => army != movedArmy);
            }
            if (start instanceof Camp) {
                start.armyTrained = false;
            }
            movedArmy.player.newConnection(connection);
        }
        return false;
    }
}