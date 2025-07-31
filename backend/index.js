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
let verifycode = null
const gameoption = io.of("/gameoption");
gameoption.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("getCode", () => {
        const code = Math.floor(Math.random() * 9000) + 1000;
        const code_string = code.toString()
        verifycode = code_string
        socket.emit("roomCode", code_string);
    });
    socket.on("verifycode", (roomcode) => {
        if (roomcode == verifycode) {
            console.log(true)
            socket.emit("message", true)
        }
        else {
            console.log(false)
            socket.emit("message", false)
        }
    });
});


//app listen
server.listen(port, () => console.log(`Server started on http://localhost:${port}`))