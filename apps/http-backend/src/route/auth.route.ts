import express, { Router } from "express"
import { createRoomController, signinController, signupController } from "../controller/auth.controller"
import { attachUser } from "../middleware/auth.middleware"

const authRouter:Router = express.Router()

authRouter.post("/signup",signupController)
authRouter.post("/signin",signinController)
authRouter.post("/createroom",attachUser,createRoomController)



export default authRouter