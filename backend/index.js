const express = require("express")
const http = require("http")
const app = express()
const port = process.env.PORT || 3000;
const { dbconnect } = require("./controller/control")
const middlewares = require("./middleware/middleware")
const server = http.createServer(app)
const { Server } = require("socket.io");
const path = require("path");
const io = new Server(server)
const mongoose = require("mongoose")
const room = require("./model/roommodel")
const dotenv = require("dotenv")
dotenv.config()

//database connect
dbconnect(process.env.mongodb)
//middleware
middlewares(app)

//view engine
app.set("view engine", "ejs")
app.set('views', __dirname + '/views');

app.get("/login", (req, res) => {
    res.render("login")
})

//server

const gameoption = io.of("/gameoption");
gameoption.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("getCode", async () => {
        const code = Math.floor(Math.random() * 9000) + 1000;
        const code_string = code.toString()
        try {
            const roomdata = await room.create({
                roomid: code_string,
                players: [socket.id]
            })  
           socket.join(code_string); 
           socket.emit("message","Msg")
           console.log(roomdata)
        }
        catch (err) {
            console.error(" Room creation error:", err.message);
        }
        socket.emit("roomCode", code_string);
      
    });

    socket.on("verifycode", async (roomcode) => {
        try {
            const roomid = await room.findOne({ roomid: roomcode.toString() });

            if (!roomid) {
                console.log("Room not found");
                socket.emit("message", "Room not found");
                return;
            }

            if (roomid.players.includes(socket.id)) {
                console.log(`${socket.id} already in room ${roomcode}`);
                return;
            }

            if (roomid.players.length >= 2) {
                console.log("Room full");
                socket.emit("message", "Room full");
                return;
            }

            try {
                roomid.players.push(socket.id);
                await roomid.save();
            } catch (e) {
                console.error("Error while saving updated room:", e);
            }

            if (roomid.players.length == 2) {
                socket.join(roomcode);
                gameoption.to(roomcode).emit("message", "Joined successfully");
            }
    

        } catch (err) {
            console.error("Error while searching room:", err.message);
        }

        console.log(`verifycode from ${socket.id} for room ${roomcode}`);
    });


})
//app listen
server.listen(port, () => console.log(`Server started on http://localhost:${port}`))