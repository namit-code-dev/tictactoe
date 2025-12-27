let boxes = document.querySelectorAll('.box');
let scorex=0;
let scorey=0;
let pattern=[
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,5,9],
    [3,5,7],
    [1,4,7],
    [2,5,8],
    [3,6,9]
]
let turn=true;


//x or 0 ke liye
boxes.forEach((element) => {
     let h2 = element.querySelector("h2");
    element.addEventListener("click", function clickfn() {
        if(turn){
             h2.innerText="X"
             turn=false
        }
        else{
            h2.innerText="0"
            turn=true
        }
        element.classList.add("disabled");

        


//winning ke liye        
for(let combo of pattern) {
  let [a, b, c] = combo;
  let h2a = boxes[a-1].querySelector("h2").innerText;
  let h2b = boxes[b-1].querySelector("h2").innerText;
  let h2c = boxes[c-1].querySelector("h2").innerText;

  if(h2a !== "" && h2a === h2b && h2b === h2c) {
    h=true
   
    alert(h2a + " wins!")
 
 //rest after every point 
      for (const a of boxes) {
boxes.forEach((element) => {
     let h3 = element.querySelector("h2");
     h3.innerText=" "
        a.classList.remove("disabled"); 
      })     
    }




    //winning person
let p1 = document.querySelector('#player1');
let p2 = document.querySelector('#player2');

   
    if(h2a=="X"){
        scorex+=1
 p1.innerText=scorex
  if (scorex==10){
    alert("game over")
    alert("player1 win")
    alert("restart the game ?")
    scorex=0
    p1.innerText=scorex
  }
    }

    else{
         scorey+=1
 p2.innerText=scorey
 if (scorey==10){
    alert("game over")
    alert("player2 win")
    alert("restart the game ?") 
    scorey=0
     p2.innerText=scorey

  }
}


//display person
 let winner=document.getElementById('winner')
if(h2a=="X"){
  winner.innerText="PLAYER1 WIN PREVIOUS ROUND";
  alert("PLAYER1 WIN")
}
else if(h2a=="0"){
   winner.innerText="PLAYER2 WIN PREVIOUS ROUND";
     alert("PLAYER2 WIN")
}
break;
}


// draw condition
let isDraw = true;
boxes.forEach((box) => {
  if (box.querySelector("h2").innerText === "") {
    isDraw = false; 
  }
});
if (isDraw) {
  alert("It's a draw!");
  boxes.forEach((element) => {
    element.querySelector("h2").innerText = "";
    element.classList.remove("disabled");
  });
  let winner = document.getElementById('winner');
  winner.innerText = "PREVIOUS ROUND WAS A DRAW";
  }

} 

    });
});






//music
let musicoff=document.getElementById("bgmusic")
let music=document.getElementById("music")
music.addEventListener("click", function m1() {
    if (music.src.includes("volume-down-fill.svg")) {
      music.src = "/images/volume-mute.svg";
      musicoff.pause();
    } else {
      music.src = "/images/volume-down-fill.svg";
      musicoff.play();
    }
})



