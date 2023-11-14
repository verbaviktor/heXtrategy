import { Hex } from "./tiles/hex.js";
import { Base } from "./tiles/base.js";
import { Forest } from "./tiles/forest.js";
import { Mountain } from "./tiles/mountain.js";
import { Village } from "./tiles/village.js";
import { camera, ctx } from "./script.js"
import { Castle } from "./tiles/castle.js";

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
            let row = [];
            let hexesInRow = this.diameter - Math.abs(y - this.radius + 1);
            for (let x = 0; x < hexesInRow; x++) {
                row.push(new Hex(x, y));
            }
            this.matrix.push(row);
        }
        this.placeBases();
        // this.generateTerrain();
    }
    render() {
        for (let y = 0; y < this.diameter; y++) {
            let hexesInRow = this.diameter - Math.abs(y - this.radius + 1);
            for (let x = 0; x < hexesInRow; x++) {
                let hex = this.matrix[y][x];
                const screen_coordinates = camera.hexToScreen(x, y);
                ctx.drawImage(hex.img, screen_coordinates[0] - camera.tileSize / 2, screen_coordinates[1] - camera.tileSize / 2, camera.tileSize, camera.tileSize);

                // this.players.forEach(player => {
                //     player.armies.forEach(army => {
                //         army.train(this, ctx, camera);
                //     });
                // });
                // if (hex instanceof Castle && hex.armyTrained == true) {
                //     hex.trainArmy(this, ctx, hex, camera);
                // }
            }
        }
    }
    placeBases() {
        //2.5 value can be changed to bring bases closer or further apart. (Smaller value -> Closer bases)
        let base1Y = Math.floor(this.radius / 2.5)
        if (base1Y % 2 == 0) {
            base1Y -= 1
        }
        
        let base2Y = this.diameter - base1Y - 1
        let baseX = (this.radius + base1Y) / 2 - 0.5

        this.matrix[base1Y][baseX] = new Base(baseX, base1Y, this.players[0]);
        this.matrix[base2Y][baseX] = new Base(baseX, base2Y, this.players[1]);
        this.players[0].baseX = baseX;
        this.players[0].baseY = base1Y;
        this.players[1].baseX = baseX;
        this.players[1].baseY = base2Y;
    }
    getTileAt(x, y) {
        try {
            return this.matrix[y][x]
        } catch (error) {
            null
        }
    }
    placeTile(tile) {
        this.matrix[tile.y][tile.x] = tile
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
                    this.matrix[hex.y][hex.x] = new Forest(hex.x, hex.y)
                    continue
                }
                if (random < forest_density + mountain_density) {
                    this.matrix[hex.y][hex.x] = new Mountain(hex.x, hex.y)
                    continue
                }
                if (random < forest_density + mountain_density + village_density) {
                    this.matrix[hex.y][hex.x] = new Village(hex.x, hex.y)
                    continue
                }
            }
        }
    }
}