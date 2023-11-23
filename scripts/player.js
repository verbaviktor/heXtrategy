export class Player{
    constructor(color) {
        this.numberOfCamps = 0;
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.color = color;
    }

    armyOfTile(tile){
        let army;
        this.armies.forEach(a => {
            if (a.targetX == tile.x && a.targetY == tile.y) {
                army = a;
            }
        });
        return army;
    }

    endGame(){
    }
}