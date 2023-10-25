export class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/Camp.svg";
        this.img = img;
    }
    
    update(ctx, input) {
        
    }
}