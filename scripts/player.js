import { Camp } from "./tiles/camp.js";

export class Player{
    constructor(color){
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.villages = [];
        this.connections = [];
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

    breakConnections(currentTile){
        let currentTileIndex;
        let index;
        this.connections.forEach(connection => {
            if (connection.includes(currentTile)){
                index = connection.indexOf(currentTile);
                connection[index].player = null;
            }
            for (let i = 0; i < connection.length; i++) {
                if (connection[i].player == null) {
                    currentTileIndex = i;
                }                
                if (i > currentTileIndex) {
                    connection[i].player = null;
                }
            }
        });
        this.updateConnections();
    }

    updateConnections(){
        this.connections.forEach(connection =>{
            for (let i = 0; i < connection.length; i++) {
                if (connection[i].player == null) {
                    if (connection[i] instanceof Camp) {
                        connection[i].reset();
                    }
                    connection.splice(i, 1);
                }                
            }
        });
    }
}