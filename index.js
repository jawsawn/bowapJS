let canvas;
let ctx;
let rafId;
let particleArray = [];
let mouseX = -10;
let mouseY = -10;
const deathAudio = new Audio('death.mp3');
const grazeAudio = new Audio('graze.mp3');
let tailCount = 2;
let radiusDistance = 0;
let speedMult = 200;
let spinRotat = 2;

let gaeColor = false;
let becomeMarisa = false;
let doSafespot = false;

let hitbox;
let clickedOnScreen = false;
let grazeCount = 0;
let scoreCount = 0;
let time = 0;
let gameStarted = false;
const gameOst = new Audio("satori_midi.mp3");
gameOst.loop = true;

function onLoad() {
    canvas = document.getElementById("maincanvas");
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    ctx = canvas.getContext("2d");
    let canvasSize = 800;
    let canvasOrigin = canvasSize / 2;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    class Particle {
        constructor(ox, oy, parent = 0, spin = 0) {
            this.x = ox;
            this.y = oy;
            this.r = radiusDistance;

            this.ox = ox;
            this.oy = oy;

            this.vr = 0.1;
            this.spin = spin;

            this.vs = spinRotat;
            this.grazed = false;

            this.parent = parent;
            this.tails = tailCount;
            this.size = 8;
            this.graze = 4;
            this.color = `hsl(${this.parent * 20},50%,50%)`;
            if (gaeColor) {
                this.randomcolor = Math.floor(Math.random() * 360);
                this.color = `hsl(${this.randomcolor},50%,50%)`;
            }


        }

        draw() {

            //Particle Despawn
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                //particleArray.splice(particleArray.indexOf(this),1)
                return;
            }

            //Game Start
            if (clickedOnScreen) {
                //Grazing
                if (this.x - this.graze < mouseX && this.x + this.size + this.graze > mouseX && this.y - this.graze < mouseY && this.y + this.size + this.graze > mouseY) {
                    if (!this.grazed) {
                        grazeCount++;
                        document.getElementById("grazeLabel").innerText = grazeCount;
                        this.grazed = true;
                    }
                    grazeAudio.play();

                    //Graze Color Handling
                    this.color = `hsl(${this.parent * 20},50%,70%)`
                    if (gaeColor)
                        this.color = `hsl(${this.randomcolor},50%,70%)`;
                } else {

                    this.color = `hsl(${this.parent * 20},50%,50%)`
                    if (gaeColor)
                        this.color = `hsl(${this.randomcolor},50%,50%)`;
                }

                //Death
                if (this.x < mouseX && this.x + this.size > mouseX && this.y < mouseY && this.y + this.size > mouseY) {
                    if(!(doSafespot && canvasOrigin-10 < mouseX && canvasOrigin+10 > mouseX && canvasOrigin-10 < mouseY && canvasOrigin+10 > mouseY)) {
                        deathAudio.play();
                        time = 0;
                        scoreCount = 0;
                    }
                    
                }
            }

            //Draw Particles
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            let sinF = Math.sin(this.spin / 20) * speedMult;

            if (this.parent == 0) {
                this.x = this.ox + this.r * Math.cos(this.spin)
                this.y = this.oy + this.r * Math.sin(this.spin)
                this.spin += this.vr;
            }

            for (let index = 0; index < this.tails; index++) {
                if (this.parent == index + 1) {
                    this.x += this.vs * Math.cos(sinF + ((index + 1) / this.tails) * 2 * Math.PI);
                    this.y += this.vs * Math.sin(sinF + ((index + 1) / this.tails) * 2 * Math.PI);
                }
            }

            if (this.parent == 0) {
                for (let index = 0; index < this.tails; index++) {
                    particleArray.push(new Particle(this.x, this.y, index + 1, this.spin));

                }
            }


        }
    }

    function animate() {
        rafId = requestAnimationFrame(animate)
        //animation below
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        particleArray.forEach(e => e.draw())
        //Draw Character
        if (gameStarted) {
            if(becomeMarisa) {
                ctx.fillStyle = "#FF0";
                ctx.fillRect(mouseX - 25, mouseY - 25, 50, 50);
            }
            if(!becomeMarisa) {
                ctx.fillStyle = "#F00";
                ctx.fillRect(mouseX - 1, mouseY - 1, 2, 2);
            }
            
            time++;
            document.getElementById("scoreLabel").innerText = time * (grazeCount + 1);
        }
    }

    particleArray.push(new Particle(canvasOrigin, canvasOrigin, 0, 0));
    animate()
}


function onClick(e) {
    canvas.style.cursor = "none";

    canvas.title = "";
    gameStarted = true;

    if (!clickedOnScreen) {
        gameOst.play();
        document.getElementById("stopMusic").style.visibility = "visible";
        document.getElementById("stopMusicLabel").style.visibility = "visible";

    }
    clickedOnScreen = true;
}

function onMouseMove(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
    if (clickedOnScreen)
        gameStarted = true;
}

function onMouseLeave() {
    mouseX = -10;
    mouseY = -10;
    gameStarted = false;
}

function handleRestart() {
    tailCount = document.getElementById("tailInput").value;
    radiusDistance = document.getElementById("radiusInput").value;
    speedMult = document.getElementById("speedMult").value;
    spinRotat = document.getElementById("spinRotat").value;


    gaeColor = document.getElementById("gaeInput").checked;
    doSafespot = document.getElementById("doSafespot").checked;

    //Restarts the Game
    cancelAnimationFrame(rafId)
    particleArray = [];
    onLoad()
}

function handleCosmetic() {
    if(clickedOnScreen)
    if (document.getElementById("stopMusic").checked) 
        gameOst.pause(); else gameOst.play();
    
    becomeMarisa = document.getElementById("becomeMarisa").checked;
}

function saveCanvas() {      
        
        var imageObject = new Image();
        imageObject.src = canvas.toDataURL("image/png");   
        
 
        // Saving it locally automatically
        let link = document.createElement("a");
        link.setAttribute('download', "bowapJS" + Date.now())
        link.href= imageObject.src
        link.click()               
     
}