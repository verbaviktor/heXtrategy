export class Player{
    constructor(color){
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.villages = [];
        this.color = color;
    }
    
    startTurn(){
        this.villages.forEach(village => {
            village.upgrade();
            this.gold += village.level;
        })
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
}