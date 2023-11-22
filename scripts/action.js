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
        if (this.type == "BUILDCAMP") {
            map.getTileAt(this.x, this.y).placeCamp(new Camp(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "BUILDTOWER"){
            map.getTileAt(this.x, this.y).upgrade(new Tower(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "BUILDCASTLE"){
            map.getTileAt(this.x, this.y).upgrade(new Castle(this.x, this.y, map.playerInTurn));
        }
        else if(this.type == "TRAINARMY"){
            map.getTileAt(this.x, this.y).trainArmy();
        }
        else if(this.type == "MOVEARMY"){
            const army = map.playerInTurn.armyOfTile(map.getTileAt(this.x, this.y));
            army.targetX = this.x;
            army.targetY = this.y;
            army.direction = [this.destX, this.destY];
            army.moveArmy();
        }
    }
}