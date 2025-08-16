let scorex = 0;
let scorey = 0;
const socket = io("/namitgame"); 

let turn = true;


let p1 = document.getElementById("player1");
let p2 = document.getElementById("player2");

let boxes = document.querySelectorAll('.box');


function resetBoard() {
  for (const box of boxes) {
    const h2 = box.querySelector("h2");
    h2.innerText = "";
    box.classList.remove("disabled");
  }
  turn = true;
}


boxes.forEach((element, index) => {
  element.addEventListener("click", function () {
    if (!element.classList.contains("disabled")) {
      let value = turn ? "X" : "0";
      socket.emit("box-clicked", { index, value });
    }
  });
});


socket.on("update-box", ({ index, value }) => {
  let element = boxes[index];
  let h2 = element.querySelector("h2");

  if (!element.classList.contains("disabled")) {
    h2.innerText = value;
    element.classList.add("disabled");
    turn = value !== "X"; 
  }
});


socket.on("invalid-move", ({ index, message }) => {
  alert("Invalid move at box " + index + ": " + message);
});


socket.on("pattern", (pattern) => {
  for (let combo of pattern) {
    let [a, b, c] = combo;
    let h2a = boxes[a].querySelector("h2").innerText;
    let h2b = boxes[b].querySelector("h2").innerText;
    let h2c = boxes[c].querySelector("h2").innerText;

    if (h2a !== "" && h2a === h2b && h2b === h2c) {
      socket.emit("winner", h2a);
      resetBoard();
      break;
    }
  }
});


socket.on("show-winner", (winnername) => {
  alert(winnername);

  if (winnername === "Player 1 is the winner") {
    scorex++;
    p1.innerText = scorex;
    if (scorex ===10) {
      alert("Game Over\nPlayer 1 wins the series\nRestarting game...");
      scorex = 0;
      scorey = 0;
      p1.innerText = scorex;
      p2.innerText = scorey;
    }
  } else if (winnername === "Player 2 is the winner") {
    scorey++;
    p2.innerText = scorey;
    if (scorey === 10) {
      alert("Game Over\nPlayer 2 wins the series\nRestarting game...");
      scorex = 0;
      scorey = 0;
      p1.innerText = scorex;
      p2.innerText = scorey;
    }
  }

  resetBoard();
});

