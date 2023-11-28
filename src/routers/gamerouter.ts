import { json } from "body-parser"
import { Router } from "express"
import prisma from "../db";
import { Action, ActionType, Lobby } from "@prisma/client";

const gamerouter = Router()

gamerouter.post('/endturn', async (req: any, res: any) => {
    const user = req.user
    const lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId) as Lobby
    if (lobby.currentPlayer != user.indexInLobby) {
        res.status(403)
        res.json({ error: "It is not your turn!" })
        return
    }
    const actions = await prisma.lobby.getLobbyActions(lobby.id)
    if (actions.length != 0) {
        await prisma.action.deleteMany({
            where: {
                lobbyId: lobby.id
            }
        })
        console.log(actions)
        res.status(201)
        res.json({ actions })
        return
    }
    console.log("Recieved action from old player: ")
    for (const action of req.body) {
        await prisma.action.create({
            data: {
                x: action.x,
                y: action.y,
                lobbyId: lobby.id,
                type: action.type,
                destX: action.destX,
                destY: action.destY
            }
        })
    }
    await prisma.lobby.update({
        where: {
            id: lobby.id
        },
        data: {
            currentPlayer: (lobby.currentPlayer + 1) % 2,
        }
    })
    res.status(200)
    res.json()
})

gamerouter.get('/fetchgame', async (req: any, res: any) => {
    const user = req.user
    const lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId) as Lobby

    if (lobby.currentPlayer == user.indexInLobby) {
        const actions = await prisma.lobby.getLobbyActions(lobby.id)
        await prisma.action.deleteMany({
            where: {
                lobbyId: lobby.id
            }
        })
        console.log("Sending actions to new player: ")
        console.log(actions)
        res.status(201)
        res.json({ actions })
        return
    }
    res.status(200)
    res.json({ info: "It is not your turn yet!" })
})

gamerouter.get('/gameinfo', async (req: any, res: any) => {
    const user = req.user
    const lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId) as Lobby
    const gameInfo = new GameInfo(lobby.currentPlayer, [])
    res.json(gameInfo)
})

gamerouter.post('/surrender', async (req: any, res: any) => {
    const user = req.user
    const lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId) as Lobby
    await prisma.user.update({
        where: user,
        data: {
            gamesplayed: user.gamesplayed + 1,
            lobbyId: null,
            readyState: false,
            indexInLobby: null
        }
    })
    const users = await prisma.lobby.getAllUsersInLobby(lobby.id);
    const enemy = users.filter((u) => u.googleId != user.googleId)[0]
    await prisma.user.update({
        where: enemy,
        data: {
            gamesplayed: enemy.gamesplayed + 1,
            wins: enemy.wins + 1,
            lobbyId: null,
            readyState: false,
            indexInLobby: null
        }
    })
    await prisma.lobby.delete({ where: lobby })
    console.log(`${user.username} surrendered!`)
    res.json({})
})

export default gamerouter

class GameInfo {
    currentPlayer: number
    actions: any[]

    constructor(currentPlayer: number, actions: any[]) {
        this.currentPlayer = currentPlayer
        this.actions = actions
    }
}