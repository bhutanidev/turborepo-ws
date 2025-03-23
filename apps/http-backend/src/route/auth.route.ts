import express, { Router } from "express"
import { signupController } from "../controller/auth.controller"

const authRouter:Router = express.Router()

authRouter.post("/signup",signupController)

export default authRouter