import { Camp } from "./tiles/camp.js";

export class Player{
    constructor(color) {
        this.numberOfTowers = 0;
        this.numberOfCastles = 0;
        this.base;
        this.gold = 20;
        this.armies = [];
        this.connections = [];
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

    breakConnections(currentTile){
        currentTile.player = null;
        let currentTileIndex;
        this.connections.forEach(connection => {
            for (let i = 0; i < connection.length; i++) {
                if (i > currentTileIndex) {
                    connection[i].player = null;
                }
                if (connection[i].player == null) {
                    currentTileIndex = i;
                }                
            }
        });
        this.updateConnections();
    }

    updateConnections(updatedTile){
        this.connections.forEach(connection =>{
            let index = 0;
            while (connection[index] != connection[- 1]) {
                if (updatedTile && connection[index].x == updatedTile.x && connection[index].y == updatedTile.y) {
                    connection[index] = updatedTile;
                }
                if (!connection[index].player) {
                    if (connection[index] instanceof Camp) {
                        connection[index] = connection[index].reset();
                        // this.armies = this.armies.filter((army) => army != this.armyOfTile(connection[i].x, connection[i].y));
                    }
                    connection.splice(index, 1);
                    index--;
                }         
                index++;           
            }
        });
    }
    
    newConnection(tile, index){
        let newConnection = this.connections[index];
        let longerConnection;
        let shorterConnection;
        let containsEveryTile = true;

        if (newConnection) {
            newConnection.push(tile);
        }
        else{
            this.connections.push([tile]);
            newConnection = this.connections[index];
        }

        this.connections.forEach(connection => {
            if (connection && index > 0) {
                if (newConnection.length >= connection.length) {
                    longerConnection = newConnection;
                    shorterConnection = connection;
                }
                else{
                    longerConnection = connection;
                    shorterConnection = newConnection;
                }
                shorterConnection.forEach(shTile => {
                    if (!longerConnection.includes(shTile)) {
                        containsEveryTile = false;
                    }
                });
            }
        });
        if (containsEveryTile) {
            this.connections = this.connections.filter((cn) => cn != shorterConnection);
        }
    }

    endGame(){

    }
}