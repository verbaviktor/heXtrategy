import { map } from "./script.js"
import { Camp } from "./tiles/camp.js"
import { Castle } from "./tiles/castle.js"
import { Tower } from "./tiles/tower.js"

export const ActionType = {
    BUILDCAMP: "BUILDCAMP",
    BUILDTOWER: "BUILDTOWER",
    BUILDCASTLE: "BUILDCASTLE",
    TRAINARMY: "TRAINARMY",
    MOVEARMY: "MOVEARMY"
}

export class Action {
    constructor(x, y, type, direction) {
        this.x = x;
        this.y = y;
        this.type = type;
        if (direction != null) {
            this.destX = direction[0];
            this.destY = direction[1];
        } else {
            this.destX = 0;
            this.destY = 0;
        }
    }

    execute(){
        let tile;
        tile = map.getTileAt(this.x, this.y);
        if (this.type == "BUILDCAMP") {
            tile.placeCamp(new Camp(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "BUILDTOWER"){
            tile.upgrade(new Tower(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "BUILDCASTLE"){
            tile.upgrade(new Castle(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "TRAINARMY"){
            tile.trainArmy();
        }
        else if(this.type == "MOVEARMY"){
            const army = map.playerInTurn.armyOfTile(tile);
            army.direction = [this.destX, this.destY];
        }
    }
}