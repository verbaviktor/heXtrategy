import express from 'express';
import lobbyrouter from './routers/lobbyrouter';
import morgan from 'morgan';
import cors from 'cors';
import { verifyInLobby, verifyNotInLobby, verifyUser } from './auth/auth';
import { getUserData, logIn } from './handlers/user';
import menurouter from './routers/menurouter';

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/getuser', verifyUser, getUserData)
app.post('/login', logIn)
app.use('/lobby', verifyUser, verifyInLobby, lobbyrouter)
app.use('/menu', verifyUser, verifyNotInLobby, menurouter)

export default app;