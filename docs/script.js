document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/namitgame");

  const boxes = document.querySelectorAll(".box");
  const p1 = document.getElementById("player1");
  const p2 = document.getElementById("player2");
  const turnStatus = document.getElementById("turnStatus");

  let myRole = "";
  let currentTurn = "";
  const roomCode = "1234";

  // Load scores from localStorage or initialize
  let scores = JSON.parse(localStorage.getItem("scores")) || { X: 0, O: 0 };
  p1.innerText = scores.X;
  p2.innerText = scores.O;

  // Join room
  socket.emit("join-room", roomCode);

  // Get assigned role
  socket.on("player-role", (role) => {
    myRole = role;
    console.log("You are:", role);
  });

  // Update turn info
  socket.on("turn-update", (turn) => {
    currentTurn = turn;
    turnStatus.innerText = turn === myRole ? "Your Turn" : "Opponent Turn";
  });

  // Box click event
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (currentTurn !== myRole) return; // Not your turn
      socket.emit("box-clicked", { roomCode, index });
    });
  });

  // Update box UI
  socket.on("update-box", ({ index, value }) => {
    boxes[index].querySelector("h2").innerText = value;
    boxes[index].classList.add("disabled");
  });

  // Show winner or draw per turn
  socket.on("show-winner", (msg) => {
    alert(msg);
    boxes.forEach(box => {
      box.querySelector("h2").innerText = "";
      box.classList.remove("disabled");
    });
  });

  // Update scores
  socket.on("update-scores", (serverScores) => {
    scores = serverScores;
    p1.innerText = scores.X;
    p2.innerText = scores.O;
    localStorage.setItem("scores", JSON.stringify(scores));
  });

  // Game over ( after 10 turns or opponent leaves)
  socket.on("game-over", (winner) => {
    alert(`🏆 Game Over! Winner: ${winner}`);
    localStorage.removeItem("scores");
    boxes.forEach(box => {
      box.querySelector("h2").innerText = "";
      box.classList.remove("disabled");
    });
    window.location.href = "/gameoption"; // redirect to room selection
  });
});
