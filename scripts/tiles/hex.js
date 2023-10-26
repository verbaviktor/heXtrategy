export class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/Hex.svg";
        this.img = img;
    }
    
    update(ctx, input) {
        
    }
}