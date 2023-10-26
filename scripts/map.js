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
            }
        }
    }
    placeBases(){
        let xOffset = Math.floor(this.radius/3);
        if (xOffset % 2 == 0) {
            xOffset--;
        }
        let yOffset = Math.floor((this.radius + xOffset)/2);

        this.matrix[xOffset][yOffset] = new Base(xOffset, yOffset, this.players[0]);
        this.matrix[this.diameter - 1 - xOffset][yOffset] = new Base(this.diameter - 1 - xOffset, yOffset, this.players[1]);
        this.players[0].baseX = xOffset;
        this.players[0].baseY = yOffset;
        this.players[1].baseX = this.diameter - 1 - xOffset;
        this.players[1].baseY = yOffset;
    }
    generateForests(){
        let numberOfForests = 10;   //number of forests on one side of the map

        for (let player = 0; player < this.players.length; player++) {
            while(numberOfForests != 0) {
                let randX = Math.random();
                let randY = Math.random();
                
                if (player == 1) {
                    randX = Math.floor(randX*(this.radius - 1) + this.radius);    //random positions for player on the bottom
                    randY = Math.floor(randY*(this.diameter - randX + this.radius - 1));

                }
                else{
                    randX = Math.floor(randX*(this.radius - 1));    //random positions for player on top
                    randY = Math.floor(randY*(this.radius + randX));
                }

                if (this.matrix[randX][randY].empty) {
                    this.matrix[randX][randY] = new Forest(randX, randY);
                    numberOfForests --;
                }
            }
            numberOfForests = 10;
        }
    }
}