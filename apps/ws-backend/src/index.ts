import { prismaClient } from "@workspace/db/client";
import { WebSocketServer } from "ws";


const wss = new WebSocketServer({
    port: 3002
});

wss.on("connection", async (socket) => {
    const user = await prismaClient.user.create({
        data: {
            email:Math.random().toString()+'@gmail.com',
            name: Math.random().toString(),
            password: Math.random().toString()
        }
    })
    socket.send("hi there you are connected to the server")
})