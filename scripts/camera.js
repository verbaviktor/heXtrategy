import { lerpNumber } from "./engine.js";
import { canvas, ctx, deltaTime, input, map } from "./script.js";

const yVector = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)];
const xVector = [1, 0];

export class Camera {
    constructor() {
        this.tileSize = canvas.width / map.diameter;
        this.targetTileSize = this.tileSize;
        this.x = 0
        this.y = 0
        this.setHexCoordinates(0, map.radius - 1)
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
        if (Math.abs(this.targetTileSize - this.tileSize) < 0.1) {
            this.tileSize = this.targetTileSize
        }
        else {
            this.tileSize = lerpNumber(this.tileSize, this.targetTileSize, 35 * deltaTime)
        }
    }

    screenToHex(screenX, screenY) {
        let world_screenY = screenY + this.y - canvas.height / 2

        let hexYGuess = (world_screenY / Math.cos(Math.PI / 6)) / (yVector[1] * this.tileSize);
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
            (worldX * this.tileSize) * Math.cos(Math.PI / 6) - this.x + canvas.width / 2,
            (worldY * this.tileSize) * Math.cos(Math.PI / 6) - this.y + canvas.height / 2
        ];
    }

    setHexCoordinates(hexX, hexY) {
        const hexScreenCoordinates = this.hexToScreen(hexX, hexY)
        this.x = hexScreenCoordinates[0] - canvas.width / 2
        this.y = hexScreenCoordinates[1] - canvas.height / 2
    }
}