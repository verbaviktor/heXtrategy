import { ctx, map } from "./script.js";

const yVector = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)];
const xVector = [1, 0];

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.tileSize = 50;
        document.addEventListener('keypress', (e) => {
            switch (e.key) {
                case 'w':
                    this.y -= 5;
                    break;
                case 'a':
                    this.x -= 5;
                    break;
                case 's':
                    this.y += 5;
                    break;
                case 'd':
                    this.x += 5;
                    break;
                default:
                    break;
            }
        })
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
        let xOffset = Math.max(map.radius - hexY, 1);
        let worldX = hexY * yVector[0] + (hexX + xOffset) * xVector[0];
        let worldY = hexY * yVector[1];
        return [
            (worldX * this.tileSize + (this.tileSize / 2)) * Math.cos(Math.PI / 6) - this.x,
            (worldY * this.tileSize + (this.tileSize / 2)) * Math.cos(Math.PI / 6) - this.y
        ];
    }
}