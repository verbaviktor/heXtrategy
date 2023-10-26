import { Hex } from "./tiles/hex.js";
import { Base } from "./tiles/base.js";
import { Forest } from "./tiles/forest.js";

export class Map {
    constructor(radius, players) {
        this.radius = radius;
        this.diameter = (radius * 2) - 1;
        this.tileSize = 50;
        this.matrix = [];
        this.players = players;
        this.generate();
    }

    generate() {
        for (let y = 0; y < this.diameter; y++) {
            let row = [];
            let hexesInRow = this.diameter - Math.abs(y - this.radius + 1);
            for (let x = 0; x < hexesInRow; x++) {
                row.push(new Hex(x, y));
            }
            this.matrix.push(row);
        }
        this.placeBases();
        this.generateForests();
    }
    render(ctx, camera) {
        for (let y = 0; y < this.diameter; y++) {
            let hexesInRow = this.diameter - Math.abs(y - this.radius + 1);
            let xOffset = 0;
            if (y < this.radius) {
                xOffset = this.radius - y - 1;
            }
            for (let x = 0; x < hexesInRow; x++) {
                let hex = this.matrix[y][x];
                const screen_coordinates = camera.hexToScreen(x, y, this.radius);
                ctx.drawImage(hex.img, screen_coordinates[0], screen_coordinates[1], this.tileSize / Math.cos(Math.PI / 6), this.tileSize / Math.cos(Math.PI / 6));
                // ctx.fillText((String(x) + " " + String(y)), screenX + 200, screenY + 100);
            }
        }
    }
    placeBases(){
        let xOffset = Math.floor(this.radius/3);
        if (xOffset % 2 == 0) {
            xOffset--;
        }
        let yOffset = Math.floor((this.radius + xOffset)/2);

        this.matrix[xOffset][yOffset] = new Base(xOffset, yOffset, this.players[0])
        this.matrix[this.diameter - 1 - xOffset][yOffset] = new Base(this.diameter - 1 - xOffset, yOffset, this.players[1])
    }
    generateForests(){
        let numberOfForests = 10;
        while(numberOfForests != 0) {
            let randX = Math.random();
            let randY = Math.random();

            this.players[0].base.x < this.radius ? randX = Math.round(randX*(this.radius - 2)) : Math.round(randX = this.radius*(randX + 1));
            randY = Math.round(randY*(this.radius + randX));

            if (typeof this.matrix[randX][randY] == "Hex") {
                this.matrix[randX][randY] = new Forest(randX, randY);
                numberOfForests --;
            }
        }
    }
}