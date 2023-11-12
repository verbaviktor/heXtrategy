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

    screenToHex(x, y, map) {
        const diameter = map.tileSize/Math.cos(Math.PI / 6);     //diameter of one tile in screenCoordinates
        const rowHeight = diameter * 3/4;                                   //hexagon diameter without the quarter at the bottom

        const row1Index = Math.floor(y/rowHeight) - 1;                      //index of the row above the clicked point
        const row2Index = Math.floor(y/rowHeight)                           //index of the row where the clicked point is
        const row1Center = row1Index * rowHeight + diameter/2;              //horizontal center line of the row in screenCoordinates
        const row2Center = row2Index * rowHeight + diameter/2;

        const offset1 = Math.abs(map.radius - 1 - row1Index) * map.tileSize/2 + 278;
        const offset2 = Math.abs(map.radius - 1 - row2Index) * map.tileSize/2 + 278;
        let x1 = x - offset1;
        let x2 = x - offset2;

        const col1Index = Math.floor(x1/map.tileSize);           //index of the column where the clicked x point is in the first row
        const col2Index = Math.floor(x2/map.tileSize);           //index of the column where the clicked x point is in the second row
        const col1Center = col1Index * map.tileSize + map.tileSize/2 + offset1;   //vertical center line of the first column 
        const col2Center = col2Index * map.tileSize + map.tileSize/2 + offset2;

        const xDistance1 = Math.abs(x - col1Center);                        //distance between the clicked point and the vertical center of the first tile
        const xDistance2 = Math.abs(x - col2Center);
        const yDistance1 = Math.abs(y - row1Center);                        //distance between the clicked point and the horizontal center of the first tile
        const yDistance2 = Math.abs(y - row2Center);
        const distance1 = xDistance1 + yDistance1;                          //total distance between the clicked point and the center point of the first tile
        const distance2 = xDistance2 + yDistance2;
        
        let tile;
        let centerpoint = {
            x : 0,
            y : 0
        };
        if (distance1 > distance2) {
            tile = map.matrix[row2Index][col2Index];
            centerpoint.x = col2Center;
            centerpoint.y = row2Center;
        }
        else{
            tile = map.matrix[row1Index][col1Index];
            centerpoint.x = col1Center;
            centerpoint.y = row1Center;
        }
        return [tile, centerpoint];
    }

    hexToScreen(hexX, hexY, mapRadius) {
        let xOffset = Math.max(mapRadius - hexY, 1);
        let screenX = hexY * yVector[0] + (hexX + xOffset) * xVector[0];
        let screenY = hexY * yVector[1];
        return [screenX * 50 - this.x, screenY * 50 - this.y];
    }
}