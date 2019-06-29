let socket;
let worldDimenScale = 1.6;
let worldGridDimenY = 20; // how many tiles down in world grid
let worldGridDimenX = Math.floor(worldGridDimenY * worldDimenScale);
let worldPixDimenY = 900;
let worldPixDimenX = worldPixDimenY * worldDimenScale;


function setup(){
    el = [];
    socket = io('localhost:3000');
    socket.on('mouse',
    function(data) {
      // Draw a blue circle
      fill(0,0,255);
      noStroke();
      ellipse(data.posX,data.posY,80,80);
     
    }
  );
    createCanvas(worldPixDimenX, worldPixDimenY);
}

function draw(){
    
    
}

