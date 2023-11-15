export class Player{
    constructor(color){
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.numberOfVillages = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.color = color;
    }
    
    generateGold(){
        this.gold += this.numberOfVillages;
        console.log(this.gold);
    }

    armyOfTile(tile){
        let army;
        this.armies.forEach(a => {
            if (a.x == tile.x && a.y == tile.y) {
                army = a;
            }
        });
        return army;
    }
}