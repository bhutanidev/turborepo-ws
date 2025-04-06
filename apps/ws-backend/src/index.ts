import WebSocket,{ WebSocketServer } from 'ws';
import jwt, { decode, verify } from "jsonwebtoken"
import { JWT_SECRET } from '@workspace/backend-common/config';
//websocket should be a state full backend ton store which user info ( belongs to which room )
//this architecturre store roomId mapped to the code
//whenever some one wants to join a roomn they send its id and that id is added to a thier websocket allowing only to join one room at a time\
// type : join-room , leave-room ,
type messageData = {
  type:string,//what we want to do
  roomId?:number,//roomid
  changeCode?:string,//changes in the code
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

function BroadcastInRoom(
  wss:WebSocketServer,
  roomId:number,
  message:object,
  sender:extendedWebSocket
){
  const msgstr = JSON.stringify(message)
  wss.clients.forEach((client)=>{
    const ws = client as extendedWebSocket

    if(ws.OPEN && ws.roomId===roomId && ws!== sender){
      ws.send(msgstr)
    }
  })
}

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
  ws.send("connected to wss")
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')
    console.log(token);
    
    //decode the token 
    if(!token){
      ws.close()
      console.log("token not found")
      return
    }
    const userId = checkUser(token)
    
    if(!userId){
      ws.close()
      return
    }
    console.log("user Connected with id : " , userId)
    
  ws.on('message',(message:string)=>{
    const data:messageData = JSON.parse(message)
    let {type,changeCode,roomId,cursorPosition} = data

    if(type == "create-room"){
      if(!roomId){
        ws.send("No room id sent")
        return
      }
      if(!ws.roomId){
        const roominfo = rooms.get(roomId)
        if(roominfo){
          console.log("room already exists with this id")
          ws.send("room already exists with this id")
          return
        }
        rooms.set(roomId,{code:"",users:1})
        ws.roomId=roomId
        console.log("creaed room with id: ",roomId);
        ws.send("created room")
      }else{
        console.log("already in a room with room id: ",roomId)
        ws.send("Already in a room . Leave the room to enter a new one.")
      }
    }

    if(type=="join-room"){
      if(!roomId){
        ws.send("No room id sent")
        return
      }
      if(!ws.roomId){
        if(rooms.has(roomId)){
          ws.roomId = roomId
          const roominfo = rooms.get(roomId)
          if(!roominfo)return
          rooms.set(roomId,{...roominfo,users:roominfo.users+1});
          console.log("joined room with id: " , roomId);
          ws.send("room joined")
        }else{
          ws.send("Room does not exist");
        }
      }else{
        ws.send("Already in a room . Leave the room to enter a new one.")
      }
      console.log(rooms)
      
    }

    if(type == "leave-room"){
      if(ws.roomId){
        const room = ws.roomId
        ws.roomId =undefined
        const roominfo = rooms.get(room);
        if(!roominfo)return
        if(roominfo.users>0)rooms.set(room,{...roominfo,users:roominfo?.users-1})
        else rooms.delete(room)
        console.log("left room with id: ", room);
        ws.send("room left")
      }
    }
    if(type=="send-code"){
      ws.send("inside send-code")
      if(!changeCode){
        ws.send("no applied changes")
        return
      }
      if(ws.roomId){
        const roominfo = rooms.get(ws.roomId)
        if(!roominfo){
          console.log("Room does not exist")
          ws.send("Room does not exist")
          return
        }
        const msg = {
          type:"code-update",
          changedcode: changeCode
        }
        rooms.set(ws.roomId,{...roominfo,code:changeCode})
        BroadcastInRoom(wss,ws.roomId,msg,ws)
        ws.send("code changed")
      }else{
        console.log("not connected to any room");
        ws.send("Not connected to any room")
      }
    }
  });
  ws.on('close',()=>{
    if(ws.roomId){
      const room = ws.roomId
      ws.roomId =undefined
      const roominfo = rooms.get(room);
      if(!roominfo)return
      if(roominfo.users>0)rooms.set(room,{...roominfo,users:roominfo?.users-1})
      else rooms.delete(room)
    }
    console.log("disconnected from wss");
  })
});