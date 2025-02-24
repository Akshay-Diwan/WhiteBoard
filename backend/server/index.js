import express from 'express';
import {WebSocketServer} from 'ws';
const app = express();
const PORT = 8080;
  
const server = app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}...`);
})
const wss = new WebSocketServer({server});
let clients = new Set();
let id = 1;
wss.on("connection", (stream) => {
    console.log('someone connected...');
    stream.userID = id;
    id = id + 1;
    clients.add(stream);

    stream.on("message", (data)=>{
        const json = JSON.parse(data.toString());
        console.log(json);
        clients.forEach((client)=>{
            console.log('client.userID: '+client.userID);
            console.log('stream.userID: '+stream.userID);
            if(client.userID !== stream.userID){
                client.send(JSON.stringify(json));
            }
            
        })
        stream.send(JSON.stringify({message: "thanks for connecting"}));
    })
})
wss.on("close", (stream) => {
    clients.delete(stream);
})

