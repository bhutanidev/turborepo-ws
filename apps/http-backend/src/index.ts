import express from "express"
import authRouter from "./route/auth.route"
import { JWT_SECRET } from '@workspace/backend-common/config';
import cookieParser from "cookie-parser";

const app = express()
app.use(express.json())
app.use(cookieParser("igsigoig93209h"))
app.get('/',(req,res)=>{res.send("Hi from backend")})
app.use('/api',authRouter)

app.listen(3001,()=>console.log("http server running on port: 3001",))
