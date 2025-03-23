import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', function connection(ws,request) {
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')

  //decode the token 

  ws.on('message', function message(data) {
    ws.send("pong")
    console.log("Inside message")
  });
});