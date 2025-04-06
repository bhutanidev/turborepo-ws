import WebSocket,{ WebSocketServer } from 'ws';
import jwt, { decode, verify } from "jsonwebtoken"
import { JWT_SECRET } from '@workspace/backend-common/config';
//websocket should be a state full backend ton store which user info ( belongs to which room )
//this architecturre store roomId mapped to the code
//whenever some one wants to join a roomn they send its id and that id is added to a thier websocket allowing only to join one room at a time\

type messageData = {
  type:string,//what we want to do
  roomId?:number,
  changeCode?:string,
  cursorPosition?:{line:number,column:number}
}

interface extendedWebSocket extends WebSocket{
  roomId?:number
}

type roomInfo = {
  code:string,
  users:number
}

const rooms:Map<number,roomInfo> = new Map()

const wss = new WebSocketServer({ port: 3002 });
function checkUser(token:string):string|null{
  const decoded = jwt.verify(token,JWT_SECRET)

  if(typeof decoded == "string"){
    return null
  }

  if(!decoded || !decoded.id){
    return null
  }

  return decoded.id
}
wss.on('connection', function connection(ws:extendedWebSocket,request) {
  
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')
    
    //decode the token 

    const userId = checkUser
    
    if(!userId){
      ws.close()
      return
    }
    console.log("user Connected with id : " , userId)
    
  // ws.on('message',(message:string)=>{
  //   const data:messageData = JSON.parse(message)
  //   let {type,changeCode,roomId,cursorPosition} = data

  //   if(!roomId)return

  //   if(type=="join-room"){
  //     if(!ws.roomId){
  //       if(rooms.has(roomId)){
  //         ws.roomId = roomId
  //         const roominfo = rooms.get(roomId)
  //         if(!roominfo)return
  //         rooms.set(roomId,{roominfo});
  //       }else{
  //         ws.send("Room does not exist");
  //       }
  //     }else{
  //       ws.send("Already in a room . Leave the room to enter a new one.")
  //     }
  //   }

  //   if(type == "leave-room"){
  //     if(ws.roomId){
  //       ws.roomId =undefined
  //     }
  //   }


  // });
  ws.on('close',()=>console.log("user disconnected")
  )
});