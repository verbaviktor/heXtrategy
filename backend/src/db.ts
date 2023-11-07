import { PrismaClient, User, Lobby, LobbyState } from '@prisma/client'
import { LobbyInfo } from './routers/lobbyrouter'

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
            async isInLobby(googleId: string) {
                const user = await prisma.user.getUserFromGoogleId(googleId)
                return user.lobbyId !== null
            },
            async joinLobby(googleId: string, lobbyId: string) {
                const lobby = (await prisma.lobby.getLobbyFromLobbyId(lobbyId as string)) as Lobby;
                await prisma.user.update({
                    where: {
                        googleId
                    },
                    data: {
                        lobbyId: lobby.id,
                        indexInLobby: lobby.playerCount
                    }
                })
            },
            async exitLobby(googleId: string) {
                await prisma.user.update({
                    where: {
                        googleId
                    },
                    data: {
                        lobbyId: null,
                        indexInLobby: null,
                    }
                })
            },
            async setPlayerReady(googleId: string, readyState: boolean) {
                await prisma.user.update({
                    where: {
                        googleId
                    }, data: {
                        readyState
                    }
                })
            }

        },
        lobby: {
            async getLobbyFromLobbyId(lobbyId: string) {
                const lobby = await prisma.lobby.findUnique({ where: { id: lobbyId as string } })
                return lobby
            },
            async getAllUsersInLobby(lobbyId: string) {
                const players = await prisma.user.findMany({
                    where: {
                        lobbyId
                    }
                })
                return players
            },
            async getLobbyInfo(lobbyId: string) {
                const lobby = await prisma.lobby.getLobbyFromLobbyId(lobbyId) as Lobby
                return new LobbyInfo(lobby.id, await prisma.lobby.getAllUsersInLobby(lobby.id))
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
            async setLobbyState(lobbyId: string, lobbyState: LobbyState) {
                await prisma.lobby.update({
                    where: {
                        id: lobbyId
                    }, data: {
                        lobbyState
                    }
                })
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
            },
            async isAllPlayerReady(lobbyId: string) {
                const users = await prisma.lobby.getAllUsersInLobby(lobbyId)
                console.log(users.map(user => !user.readyState))
                return users.filter(user => !user.readyState).length === 0
            }
        }
    },
})

export default prisma 