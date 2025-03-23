import express from "express"
import authRouter from "./route/auth.route"

const app = express()
app.use(express.json())

app.use('/api',authRouter)

app.listen(3001,()=>console.log("http server running on port: 3001",))
