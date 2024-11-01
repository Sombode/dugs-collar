const socket = io();
const setupRButton = document.getElementById("setupRecieve");
const setupTButton = document.getElementById("setupTransmit");
const indicator = document.getElementById("indicator");

const modes = {
  UNDEF: "undefined",
  RECIEVE: "recieve",
  TRANSMIT: "transmit"
};

const lines = [
  new Audio("/dugs-collar/voicelines/HITHERE.wav"),
  new Audio("/dugs-collar/voicelines/YES.wav"),
  new Audio("/dugs-collar/voicelines/COLLAR.wav"),
  new Audio("/dugs-collar/voicelines/NAME.wav"),
  new Audio("/dugs-collar/voicelines/SQUIRREL.wav")
];

let unloadedLinesLeft = lines.length;
let mode = modes.UNDEF;

setupRButton.addEventListener("click", () => {
  mode = modes.RECIEVE;
  document.body.style.setProperty("background-color", "#000000");
  document.getElementById("setup").style.display = "none";
  indicator.style.display = "block";
  socket.emit("newReciever");
});

setupTButton.addEventListener("click", () => {
  mode = modes.TRANSMIT;
  document.getElementById("setup").style.display = "none";
  document.getElementById("controls").style.visibility = "visible";
  socket.emit("newTransmitter");
});


socket.on("updateCounts", (recievers, transmitters) => {
  switch(mode) {
    case modes.RECIEVE:
      if(transmitters <= 0) {
        indicator.style.setProperty("background-color", "#94c8ff");
        indicator.style.setProperty("animation", "blink-animation 2s steps(5, start) infinite");
        indicator.style.setProperty("-webkit-animation", "blink-animation 2s steps(5, start) infinite");
        indicator.style.visibility = "visible";
      } else {
        indicator.style.setProperty("background-color", "#ff4242");
        indicator.style.setProperty("animation", "none");
        indicator.style.setProperty("-webkit-animation", "none");
        indicator.style.visibility = "hidden";
      }
      break;
    case modes.TRANSMIT:
      console.log("There are now " + recievers + " recievers and " + transmitters + " transmitters");
      break;
    default:
      break;
  }
});

socket.on("playLine", (line) => {
  if(mode != modes.RECIEVE) return;
  indicator.style.visibility = "visible";
  lines[line].play();
})

lines.forEach((line) => {
  line.addEventListener("loadeddata", () => {
    unloadedLinesLeft--;
    console.log("Loaded a file. " + unloadedLinesLeft + " left.");
    if(unloadedLinesLeft <= 0) indicator.classList.remove("unloaded");
  });
  line.addEventListener("ended", () => {
    indicator.style.visibility = "hidden";
  })
});

for(var button of document.getElementsByClassName("audioButton")) {
  button.addEventListener("click", (e) => {
    socket.emit("triggerLine", e.target.getAttribute("line"));
  });
}
//document.getElementsByClassName("audioButton").forEach((button) => {
//  button.addEventListener("click", () => {
//    console.log(this.getAttribute("line"));
//  });
//});