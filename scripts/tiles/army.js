export class Army {
    constructor(x, y, player) {
        this.player = player;
        this.x = x;
        this.y = y;
        let img = new Image();
        img.src = "../resources/ArmyBanner.svg";
        this.img = img;
    }

    place(map, ctx, camera) {
        const centerpoint = camera.hexToScreen(this.y, this.x, map.radius);
        ctx.drawImage(this.img, centerpoint[0] - map.tileSize*0.05, centerpoint[1] - map.tileSize*1.4, map.tileSize*1.2, map.tileSize*2.5);
    }
}