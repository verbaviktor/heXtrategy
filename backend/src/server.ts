import express from 'express';
import router from './lobbyrouter';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './auth/auth';
import { getUserData, logIn } from './handlers/user';

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/getuser', protect, getUserData)
app.post('/login', logIn)
app.use('/lobby', protect, router)

export default app;