import { json } from "body-parser"
import { Router } from "express"

const gamerouter = Router()

gamerouter.post('/endturn', (req: any, res: any) => {
    console.log(req.body.actions);
})

export default gamerouter