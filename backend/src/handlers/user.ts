import { create } from "domain";
import { createJWT, hashPassword } from "../auth/auth";
import prisma from "../db";
import { User } from "@prisma/client";

export const logIn = async (req: any, res: any) => {
    let user = await prisma.user.findUnique({
        where: {
            googleId: req.body.googleId
        }
    })

    if (!user) {
        user = await prisma.user.signUp(req.body.email, req.body.username, req.body.googleId)
        console.log('Created new user: ' + user.username)
    }
    else {
        console.log('User logged in: ' + user.username)
    }

    const token = createJWT(user)
    res.json({ token })
}

export const getUserData = async (req: any, res: any) => {
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)
    console.log('Getting user data for: ' + ((user as User).username))
    res.json(user)
}