import { PrismaClient, User, Lobby } from '@prisma/client'
import { LobbyInfo } from './lobbyrouter'

const prisma = new PrismaClient().$extends({
    model: {
        user: {
            async signUp(email: string, username: string, googleId: string) {
                const user = await prisma.user.create({
                    data: {
                        email,
                        username,
                        googleId
                    }
                })
                return user as User
            },
            async getUserFromGoogleId(googleId: string) {
                const user = await prisma.user.findUnique({
                    where: {
                        googleId
                    }
                })
                return user as User
            },
            async setLobbyId(googleId: string, lobbyId: string | null) {
                await prisma.user.update({
                    where: {
                        googleId
                    },
                    data: {
                        lobbyId
                    }
                })
            }
        },
        lobby: {
            async getLobbyFromLobbyId(lobbyId: string) {
                const lobby = await prisma.lobby.findUnique({ where: { id: lobbyId as string } })
                return lobby
            },
            async getAllUsersInLobby(lobby: Lobby) {
                const players = await prisma.user.findMany({
                    where: {
                        lobbyId: lobby.id
                    }
                })
                return players
            },
            async getLobbyInfo(lobbyId: string) {
                const lobby = await prisma.lobby.getLobbyFromLobbyId(lobbyId) as Lobby
                return new LobbyInfo(lobby.id, await prisma.lobby.getAllUsersInLobby(lobby))
            },
            async getAllLobbiesInfo() {
                const lobbies = await prisma.lobby.findMany({
                    where: {
                        playerCount: 1,
                    }
                });

                let lobbiesInfo: LobbyInfo[] = [];

                for (const lobby of lobbies) {
                    lobbiesInfo.push(await prisma.lobby.getLobbyInfo(lobby.id));
                }

                return lobbiesInfo;
            },
            async modifyPlayerCount(lobbyId: string, modifyBy: number) {
                const lobby = await prisma.lobby.getLobbyFromLobbyId(lobbyId) as Lobby
                await prisma.lobby.update({
                    where: {
                        id: lobbyId
                    }, data: {
                        playerCount: lobby.playerCount + modifyBy
                    }
                })
            }
        }
    },
})

export default prisma 