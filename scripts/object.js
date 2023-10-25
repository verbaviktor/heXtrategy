export class Object {
    constructor(imgPath, x = 0, y = 0) {
        var img = new Image();
        img.src = imgPath;
        this.width = img.width;
        this.height = img.height;
        this.x = x;
        this.y = y;
        this.img = img;
    }
}