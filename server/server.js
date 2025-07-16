const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors(
    {
        origin: "http://localhost:5173",
    }
))
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
app.use(express.static( '../public'));

io.on('connect',(socket)=>{
    console.log("new user connected", socket.id);
    socket.on('creating shape', (message, room)=>{
        if(room){
            console.log('joined a room');
            io.to(room).emit('creating shape', message);
        }
    });
    socket.on('change in shapes', (message, room)=>{
        if(room){
            io.to(room).emit('change in shapes', message);
        }
    })
    socket.on('join',async (room)=>{
        console.log(`socket id: ${socket.id}: roomID : ${room}`);
        socket.join(room);
        const allSockets = await io.in(room).fetchSockets()
        const count = allSockets.length
        io.in(room).emit('new user joined', count);
        
    })
    socket.on('leave', (room)=>{
        socket.leave(room);
    })
    socket.on('canvas dimensions',(dimensions, room)=>{
        if(room){
           io.to(room).emit('canvas dimensions', dimensions);
        }
    })
    
})
// app.get('/',(req, res)=>{
//     console.log(path.dirname);
//     res.send(path.join(path.dirname, '..','public','index'));
// })
server.listen(8080, ()=>{console.log("listening to port 8080")})
