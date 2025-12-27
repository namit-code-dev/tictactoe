const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 3000;

const { dbconnect } = require("./controller/control");
const middlewares = require("./middleware/middleware");

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");
const room = require("./model/roommodel");
const dotenv = require("dotenv");
dotenv.config();

dbconnect(process.env.mongodb);
middlewares(app);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "../public")));

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname, "../public/frontpage.html"));
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Game lobby namespace
const gameoption = io.of("/gameoption");

gameoption.on("connection", (socket) => {
  console.log("Client connected (gameoption):", socket.id);

  // Create new room
  socket.on("getCode", async () => {
    const code = Math.floor(Math.random() * 9000) + 1000;
    const code_string = code.toString();

    try {
      const roomdata = await room.create({
        roomid: code_string,
        players: [socket.id],
      });
      socket.join(code_string);
      socket.emit("message", "Room created");
      socket.emit("roomCode", code_string);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Join existing room
  socket.on("verifycode", async (roomcode) => {
    try {
      const roomdata = await room.findOne({ roomid: roomcode.toString() });
      if (!roomdata) return socket.emit("message", "Room not found");
      if (roomdata.players.length >= 2) return socket.emit("message", "Room full");

      roomdata.players.push(socket.id);
      await roomdata.save();
      socket.join(roomcode);
      gameoption.to(roomcode).emit("message", "Joined successfully");
    } catch (err) {
      console.error(err.message);
    }
  });
});

// Game namespace
const game = io.of("/namitgame");

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let games = {};

game.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Join a room
  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);

    if (!games[roomCode]) {
      games[roomCode] = {
        board: Array(9).fill(""),
        turn: "X",
        scores: { X: 0, O: 0 },
        players: {},
      };
    }

    const roomState = games[roomCode];
    const taken = Object.values(roomState.players);

    // Assign role
    if (!taken.includes("X")) roomState.players[socket.id] = "X";
    else if (!taken.includes("O")) roomState.players[socket.id] = "O";
    else roomState.players[socket.id] = "spectator";

    socket.role = roomState.players[socket.id];
    socket.emit("player-role", socket.role);
    socket.emit("update-scores", roomState.scores);
    game.to(roomCode).emit("turn-update", roomState.turn);
  });

  // Box clicked
  socket.on("box-clicked", ({ roomCode, index }) => {
    const roomState = games[roomCode];
    if (!roomState) return;

    const { board, turn, scores, players } = roomState;
    if (!players[socket.id] || players[socket.id] !== turn) return;
    if (board[index] !== "") return;

    board[index] = turn;
    game.to(roomCode).emit("update-box", { index, value: turn });

    // Check win
    for (let [a,b,c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        scores[turn]++;
        Object.keys(players).forEach(pid => {
          if (players[pid] === turn) game.to(pid).emit("show-winner", "🎉 You win");
          else if (players[pid] !== "spectator") game.to(pid).emit("show-winner", "❌ You lost");
        });
        game.to(roomCode).emit("update-scores", scores);
        roomState.board = Array(9).fill("");
        roomState.turn = "X";
        game.to(roomCode).emit("turn-update", roomState.turn);
        return;
      }
    }

    // Draw
    if (board.every(v => v !== "")) {
      game.to(roomCode).emit("show-winner", "🤝 Draw");
      roomState.board = Array(9).fill("");
      roomState.turn = "X";
      game.to(roomCode).emit("turn-update", roomState.turn);
      return;
    }

    // Next turn
    roomState.turn = turn === "X" ? "O" : "X";
    game.to(roomCode).emit("turn-update", roomState.turn);
  });

  // Handle disconnect / refresh
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    Object.keys(games).forEach(roomCode => {
      const roomState = games[roomCode];
      if (!roomState.players[socket.id]) return;

      delete roomState.players[socket.id];

      // If someone is left, notify them they win automatically
      const remainingPlayers = Object.keys(roomState.players);
      if (remainingPlayers.length === 1) {
        game.to(roomCode).emit("show-winner", "🏆 Opponent left, you win!");
      }

      // Reset board for new game
      roomState.board = Array(9).fill("");
      roomState.turn = "X";
    });
  });
});

server.listen(port, () => console.log(`Server started on http://localhost:${port}`));
