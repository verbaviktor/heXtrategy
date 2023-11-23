import { map } from "./script.js";

export function updateStats(){
    document.querySelector(".ally.camp").innerText = map.players[playerIndex].numberOfCamps;
    document.querySelector(".ally.tower").innerText = map.players[playerIndex].numberOfTowers;
    document.querySelector(".ally.castle").innerText = map.players[playerIndex].numberOfCastles;
    document.querySelector(".ally.gold").innerText = map.players[playerIndex].gold;
    document.querySelector(".enemy.camp").innerText = map.players[1 - playerIndex].numberOfCamps;
    document.querySelector(".enemy.tower").innerText = map.players[1 - playerIndex].numberOfTowers;
    document.querySelector(".enemy.castle").innerText = map.players[1 - playerIndex].numberOfCastles;
    document.querySelector(".enemy.gold").innerText = map.players[1 - playerIndex].gold;
}
