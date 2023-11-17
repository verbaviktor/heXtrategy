import express from 'express';
import lobbyrouter from './routers/lobbyrouter';
import morgan from 'morgan';
import cors from 'cors';
import { verifyInLobby, verifyNotInLobby, verifyUser } from './auth/auth';
import { getUserData, logIn } from './handlers/user';
import menurouter from './routers/menurouter';
import { ServerOptions } from 'https';
import fs from 'fs';
import https from 'https';
import bodyParser from 'body-parser';

const app = express();

app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/getuser', verifyUser, getUserData)
app.post('/login', logIn)
app.use('/lobby', verifyUser, verifyInLobby, lobbyrouter)
app.use('/menu', verifyUser, verifyNotInLobby, menurouter)

const serverOptions: ServerOptions = {
    key: fs.readFileSync('./https/server.key'),
    cert: fs.readFileSync('./https/server.crt')
}

const server = https.createServer(serverOptions, app)

export default server;