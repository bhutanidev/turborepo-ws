import { WebSocketServer } from 'ws';
import { JWT_SECRET } from '@workspace/backend-common/config';

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', function connection(ws,request) {
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')

  //decode the token 
  const decoded = ""

  if(typeof decoded == "string"){
    //close server
    ws.close()
    return
  }

  ws.on('message', function message(data) {
    ws.send("pong")
    console.log("Inside message")
  });
});