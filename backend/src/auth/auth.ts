import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

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

export const protect = (req: any, res: any, next: any) => {
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
        const user = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = user
        next()
    } catch (e) {
        res.status(401)
        res.json({ message: 'Invalid user!' })
        return
    }

}