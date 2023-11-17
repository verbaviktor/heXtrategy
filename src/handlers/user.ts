import { create } from "domain";
import { createJWT, hashPassword } from "../auth/auth";
import prisma from "../db";
import { User } from "@prisma/client";

export const logIn = async (req: any, res: any) => {
    let newUser = false
    let user = await prisma.user.findUnique({ where: { googleId: "0" } })
    try {
        user = await prisma.user.findUnique({
            where: {
                googleId: req.body.googleId
            }
        })
    } catch (error) {
        res.status(400)
        res.json(error)
        return
    }
    try {
        if (!user) {
            user = await prisma.user.signUp(req.body.email, req.body.username, req.body.googleId)
            console.log('Created new user: ' + user.username)
            newUser = true
        }
        else {
            if (req.body.email == user.email) {
                console.log('User logged in: ' + user.username)
            }
            else {
                res.status(403)
                res.json({error:"No account found with this username and password!"})
                return
            }
        }
    } catch (error) {
        res.status(400)
        res.json(error)
        return
    }

    const token = createJWT(user)
    res.json({ token, newUser })
}

export const updateUser = async (req: any, res: any) => {
    let newColor = ""
    let newUsername = ""
    try {
        newColor = req.body.newColor
        newUsername = req.body.newUsername
    } catch (error) {
        console.log(error)
        res.status(400)
        res.json(error)
        return
    }
    console.log("Updated username and color for: " + req.user.username)
    await prisma.user.updateUser(req.user.googleId, newUsername, newColor)
}

export const getUserData = async (req: any, res: any) => {
    const user = await prisma.user.getUserFromGoogleId(req.user.googleId)
    console.log('Getting user data for: ' + ((user as User).username))
    res.json(user)
}