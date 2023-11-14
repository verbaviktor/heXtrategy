import { ctx, deltaTime, input, map } from "./script.js";

const yVector = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)];
const xVector = [1, 0];

export class Camera {
    constructor() {
        this.x = - 700;
        this.y = - 100;
        this.tileSize = 50;
    }

    update() {
        if (input.isKeyDown('w')) {
            this.y -= 500 * deltaTime
        }
        if (input.isKeyDown('s')) {
            this.y += 500 * deltaTime
        }
        if (input.isKeyDown('a')) {
            this.x -= 500 * deltaTime
        }
        if (input.isKeyDown('d')) {
            this.x += 500 * deltaTime
        }
        if (input.mouseWheel != 0) {
            console.log("asdasd")
            this.tileSize *= Math.pow(1.2, input.mouseWheel)
        }
    }

    screenToHex(screenX, screenY) {
        let world_screenY = screenY + this.y
        let world_screenX = screenX + this.x

        let hexYGuess = (world_screenY / Math.cos(Math.PI / 6) - this.tileSize / 2) / (yVector[1] * this.tileSize);
        let clickedRows = [Math.floor(hexYGuess), Math.ceil(hexYGuess)]

        let min_distance_squared = 100000000000000000000000;
        let clicked_coordinates = null
        for (const y of clickedRows) {
            const tilesInRow = map.getTilesInRow(y)
            if (!tilesInRow) {
                continue
            }
            for (const hex of tilesInRow) {
                let hexScreenPosition = this.hexToScreen(hex.x, hex.y)
                let vectorFromClickToHex = [hexScreenPosition[0] - screenX, hexScreenPosition[1] - screenY]
                const distance_squared = vectorFromClickToHex[0] ** 2 + vectorFromClickToHex[1] ** 2
                if (distance_squared < min_distance_squared) {
                    clicked_coordinates = [hex.x, hex.y]
                    min_distance_squared = distance_squared
                }
            }
        };

        return clicked_coordinates;
    }

    hexToScreen(hexX, hexY) {
        let worldX = hexY * yVector[0] + hexX * xVector[0];
        let worldY = hexY * yVector[1];
        return [
            (worldX * this.tileSize + (this.tileSize / 2)) * Math.cos(Math.PI / 6) - this.x,
            (worldY * this.tileSize + (this.tileSize / 2)) * Math.cos(Math.PI / 6) - this.y
        ];
    }
}