import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { LobbyState, User } from '@prisma/client'
import prisma from '../db'

export const comparePasswords = (password: any, hash: any) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password: any) => {
    return bcrypt.hash(password, 'salt')
}

export const createJWT = (user: User) => {
    const token = jwt.sign({
        googleId: user.googleId
    },
        process.env.JWT_SECRET as string
    )
    return token
}

export const verifyUser = async (req: any, res: any, next: any) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        res.status(401)
        res.json({ message: 'No bearer sent with the request!' })
        return
    }

    const [, token] = bearer.split(" ")

    if (!token) {
        res.status(401)
        res.json({ message: 'No token sent with the bearer!' })
        return
    }

    try {
        const userToken = jwt.verify(token, process.env.JWT_SECRET as string)
        const user = await prisma.user.getUserFromGoogleId((userToken as JwtPayload).googleId)
        if (user) {
            req.user = user
            next()
            return
        }
        res.status(401)
        res.json({ message: 'Invalid user!' })
    } catch (e) {
        res.status(401)
        res.json({ message: 'Invalid user!' })
        return
    }
}

export const verifyInLobby = async (req: any, res: any, next: any) => {
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)
    if (user.lobbyId == null) {
        res.status(403)
        res.json({ Forbidden: 'Player is not in a lobby' })
        return
    }
    req.lobby = await prisma.lobby.getLobbyFromLobbyId(user.lobbyId)
    if (!req.lobby) {
        res.status(404)
        res.json()
        return
    }
    if (req.lobby.lobbyState == LobbyState.IN_PROGRESS) {
        res.status(201)
        res.json({ Continue: "Player's lobby is in progress phase!" })
        return
    }
    next()
}

export const verifyNotInLobby = async (req: any, res: any, next: any) => {
    if (await prisma.user.isInLobby(req.user.googleId)) {
        res.status(403)
        res.json({ Forbidden: 'Player is in a lobby' })
        return
    }
    next()
}

export const verifyInGame = async (req: any, res: any, next: any) => {
    if (!(await prisma.user.isInGame(req.user.googleId))) {
        res.status(403)
        res.json({ Forbidden: 'Player is in a game' })
        return
    }
    next()
}