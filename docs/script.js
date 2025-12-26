document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/namitgame");

  const boxes = document.querySelectorAll(".box");
  const p1 = document.getElementById("player1");
  const p2 = document.getElementById("player2");
  const turnStatus = document.getElementById("turnStatus");

  let myRole = "";
  let currentTurn = "";
  const roomCode = "1234";

  // join room
  socket.emit("join-room", roomCode);

  // get role (X / O)
  socket.on("player-role", (role) => {
    myRole = role;
    console.log("You are:", role);
  });

  // 🔁 turn update
  socket.on("turn-update", (turn) => {
    currentTurn = turn;
    turnStatus.innerText =
      turn === myRole ? "Your Turn" : "Opponent Turn";
  });

  // box click
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      //  wrong turn
      if (currentTurn !== myRole) return;

      socket.emit("box-clicked", { roomCode, index });
    });
  });

  // update box UI
  socket.on("update-box", ({ index, value }) => {
    boxes[index].querySelector("h2").innerText = value;
    boxes[index].classList.add("disabled");
  });

  // winner / draw
  socket.on("show-winner", (msg) => {
    alert(msg);
    boxes.forEach(box => box.querySelector("h2").innerText = "");
    window.location.href = "/gameoption";
  });

  // score update
  socket.on("update-scores", (scores) => {
    p1.innerText = scores.X;
    p2.innerText = scores.O;
  });
});
