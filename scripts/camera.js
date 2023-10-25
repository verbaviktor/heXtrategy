const yVector = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)];
const xVector = [1, 0];

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
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
    }

    hexToScreen(hexX, hexY, mapRadius) {
        let xOffset = Math.max(mapRadius - hexY, 1);
        let screenX = hexY * yVector[0] + (hexX + xOffset) * xVector[0];
        let screenY = hexY * yVector[1];
        return [screenX * 50 - this.x, screenY * 50 - this.y];
    }
}