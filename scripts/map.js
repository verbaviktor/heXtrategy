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
            }
        }
        let tileCenter;
        this.players.forEach(player => {
            player.armies.forEach(army => {
                tileCenter = camera.hexToScreen(army.x, army.y);
                ctx.drawImage(army.img, tileCenter[0] - 30, tileCenter[1] - 90, camera.tileSize*1.2, camera.tileSize*2.5)
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

    tileClicked(tile){
        if (tile instanceof Castle) {   //tile.player == playerInTurn
            tile.trainArmy();
        }
        else if (tile.constructor.name == "Hex" || tile.constructor.name == "Forest") {  //tile.player == playerInTurn
            tile.placeCamp(this, new Camp(tile.x, tile.y, tile.player));
        }
    }
    
    getMovementDirection(start, destination){
        const xDiff = destination.x - start.x;
        const yDiff = destination.y - start.y;
        if (yDiff == 0 || xDiff == 0 || Math.abs(yDiff) == Math.abs(xDiff)) {
            return [xDiff, yDiff];
        }
        return null;
    }
    moveArmy(start, destination){
        const direction = this.getMovementDirection(start, destination);

        let movedArmy;
        start.player.armies.forEach(army => {
            if (army.x == start.x && army.y == start.y) {
                movedArmy = army;
            }
        });

        if(movedArmy && direction){
            for (let i = 0; i < 6; i++) {
                if (this.matrix[movedArmy.y + direction[1]] && this.matrix[movedArmy.y + direction[1]][movedArmy.x + direction[0]]) {
                    if (this.matrix[movedArmy.y][movedArmy.x] instanceof Mountain) {
                        break;
                    }
                    movedArmy.x += direction[0];
                    movedArmy.y += direction[1];
                    this.matrix[movedArmy.y][movedArmy.x].player = movedArmy.player;
                }
                else{
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