export class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/Hex.svg";
        this.img = img;
        this.player = null;
    }

    placeCamp(map, camp){
        if (this.player.gold >= 4) {
            this.player.gold -= 4;
            map.matrix[this.y][this.x] = camp;
        }
    }
}