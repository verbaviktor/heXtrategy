export class Player{
    constructor(color){
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.color = color
    }
}