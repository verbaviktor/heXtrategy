import { Router } from "express";
import prisma from "../db";
import { User } from "@prisma/client";
import { updateUser } from "../handlers/user";

const menurouter = Router()

menurouter.post('/updateuser', async (req: any, res: any) => {
    updateUser(req, res)
})

menurouter.post('/createlobby', async (req: any, res: any) => {
    //Getting the user from the body
    const user = req.user as User

    //Creating the lobby
    let lobby = await prisma.lobby.create({ data: {} })

    //Joining the lobby with the user
    await prisma.user.joinLobby(user.googleId, lobby.id)
    await prisma.user.update({
        where: {
            googleId: user.googleId
        }, data: {
            indexInLobby: 0
        }
    })

    //Returning the lobbyId to the user.
    console.log('User ' + user.username + ' created a lobby: ' + lobby.id)
    res.status(201)
    res.json({ lobbyId: lobby.id })
})

menurouter.post('/joinlobby', async (req: any, res: any) => {
    //Getting the user from the body
    const user = req.user

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
    await prisma.user.joinLobby(user.googleId, lobby.id)
    await prisma.lobby.modifyPlayerCount(lobby.id, 1)

    console.log('User ' + user?.username + ' joined lobby: ' + lobby.id)
    console.log('\tPlayers in lobby: ' + (Number(lobby.playerCount) + 1))
    res.json({ lobby: await prisma.lobby.getLobbyInfo(lobby.id) })
})

menurouter.get('/getlobbies', async (req: any, res: any) => {
    const lobbies = await prisma.lobby.getAllLobbiesInfo()
    res.json(lobbies)
})

export default menurouter