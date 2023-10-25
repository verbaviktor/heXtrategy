import { Hex } from "./hex.js";

export class Map {
    constructor(radius) {
        this.radius = radius;
        this.diameter = (radius * 2) - 1;
        this.tileSize = 50;
        this.matrix = [];
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
}