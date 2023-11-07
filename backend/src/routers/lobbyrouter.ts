import { Router } from "express";
import prisma from "../db";
import { Lobby, LobbyState, User } from "@prisma/client";

const lobbyrouter = Router()

lobbyrouter.post('/exitlobby', async (req: any, res: any) => {
    //Getting the user from the request
    const user = req.user

    //Getting the lobby from the request
    let lobby = req.lobby
    //If the playerCount is 1, the current user was the last one, deleting the lobby
    if (lobby?.playerCount == 1) {
        console.log('User ' + user?.username + ' deleted lobby: ' + lobby?.id)
        await prisma.lobby.delete({
            where: {
                id: user?.lobbyId as string
            }
        })
    }
    else {
        console.log('User ' + user?.username + ' exited lobby: ' + lobby?.id)
        console.log('\tPlayers in lobby: ' + (Number(lobby.playerCount) - 1))
        await prisma.lobby.modifyPlayerCount(lobby?.id, -1)
    }
    
    await prisma.user.setPlayerReady(user.googleId, false)
    await prisma.user.exitLobby(user.googleId)

    res.json({ NotImplemented: 'We should return the match results here.' })
})

lobbyrouter.post('/ready', async (req: any, res: any) => {
    prisma.user.setPlayerReady(req.user.googleId, true);

    const user = req.user

    console.log('User ' + user?.username + ' is ready.')
    if (await prisma.lobby.isAllPlayerReady(user.lobbyId)) {
        console.log('Lobby started: ' + user.lobbyId)
        await prisma.lobby.setLobbyState(user.lobbyId, LobbyState.IN_PROGRESS);
        for (const player of await prisma.lobby.getAllUsersInLobby(user.lobbyId)) {
            await prisma.user.setPlayerReady(player.googleId, false)
        }
    }
    res.json()
})

lobbyrouter.post('/notready', async (req: any, res: any) => {
    prisma.user.setPlayerReady(req.user.googleId, false);
    res.json()
})

lobbyrouter.get('/gamestate', async (req: any, res: any) => {
    return req.lobby.gameState
})

export default lobbyrouter;


export class LobbyInfo {
    id: string
    users: User[]
    constructor(id: string, users: User[]) {
        this.id = id
        this.users = users
    }
}