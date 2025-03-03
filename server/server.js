const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static( '../public'));


io.on('connect', (socket)=>{
    console.log("new user connected", socket.id);
    socket.on('creating shape', (message, room)=>{
        if(room){
            console.log('joined a room');
            io.to(room).emit('creating shape', message);
        }
    });
    socket.on('change in shapes', (message, room)=>{
        if(room){
            console.log('joined a room');
            io.to(room).emit('change in shapes', message);
        }
    })
    socket.on('join',(room)=>{
        console.log(`socket id: ${socket.id}: roomID : ${room}`);
        socket.join(room);
    })
    socket.on('leave', (room)=>{
        socket.leave(room);
    })
})
app.get('/',(req, res)=>{
    console.log(path.dirname);
    res.send(path.join(path.dirname, '..','public','index'));
})
server.listen(8080, ()=>{console.log("listening to port 8080")})
