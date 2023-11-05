import { Router } from "express";
import prisma from "./db";
import { Lobby, User } from "@prisma/client";

const router = Router()

router.post('/createlobby', async (req: any, res: any) => {
    //Getting the user from the body
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)

    //User cannot create a lobby if already in one.
    if (user.lobbyId) {
        console.log('User ' + user?.username + ' tried to create a lobby, but is already in one.')
        res.status(401)
        res.json({ error: 'User is already in a lobby!' })
        return
    }

    //Creating the lobby
    let lobby = await prisma.lobby.create({ data: {} })

    //Joining the lobby with the user
    await prisma.user.setLobbyId(user.googleId, lobby.id)
    
    //Returning the lobbyId to the user.
    console.log('User ' + user?.username + ' created a lobby: ' + lobby.id)
    res.status(201)
    res.json({ lobbyId: lobby.id })
})

router.post('/joinlobby', async (req: any, res: any) => {
    //Getting the user from the body
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)

    //User cannot join a lobby if already in one.
    if (user.lobbyId) {
        console.log('User ' + user?.username + ' tried to join a lobby, but is already in one.')
        res.status(401)
        res.json({ error: 'User is already in a lobby!' })
        return
    }

    //If no lobbyId is in the body, returning a Bad request error
    if (!req.body.lobbyId) {
        console.log('User ' + user?.username + ' tried to join a lobby, but did not send a lobbyId.')
        res.status(400)
        res.json({ error: 'No lobby ID sent with Join Lobby request' })
        return
    }

    //Getting the lobby from the body
    let lobby = await prisma.lobby.getLobbyFromLobbyId(req.body.lobbyId)

    //If lobby is null, there is no such lobby. Returning a Not found error
    if (!lobby) {
        console.log('User ' + user?.username + ' tried to join a lobby, but the lobby does not exist.')
        res.status(404)
        res.json({ error: 'Lobby does not exist!' })
        return
    }

    //Joining the lobby with the user
    await prisma.user.setLobbyId(user.googleId, lobby.id)
    await prisma.lobby.modifyPlayerCount(lobby.id, 1)

    console.log('User ' + user?.username + ' joined lobby: ' + lobby.id)
    console.log('\tPlayers in lobby: ' + (Number(lobby.playerCount) + 1))
    res.json({lobby: await prisma.lobby.getLobbyInfo(lobby.id)})
})

router.post('/exitlobby', async (req: any, res: any) => {
    //Getting the user from the body
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)

    //If user is not in a lobby, they can not exit.
    if (!user.lobbyId) {
        console.log("User " + user?.username + " tried to exit a lobby, but isn't in one")
        res.status(404)
        res.json({ error: 'Player is not in a lobby!' })
        return
    }

    //Getting the lobby in which the player is in
    let lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId) as Lobby

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

    await prisma.user.setLobbyId(user.googleId, null)

    res.json({NotImplemented: 'We should return the match results here.'})
})

router.get('/getlobbies', async (req, res) => {
    const lobbies = await prisma.lobby.getAllLobbiesInfo()
    res.json(lobbies)
})
export default router;


export class LobbyInfo {
    id: string
    users: User[]
    constructor(id: string, users: User[]) {
        this.id = id
        this.users = users
    }
}