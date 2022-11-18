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
let gaeColor = false;
let hitbox;
let clickedOnScreen = false;

function onLoad() {
    canvas = document.getElementById("maincanvas");

    ctx = canvas.getContext("2d");
    let canvasSize = 800;
    let canvasOrigin = canvasSize / 2;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    //background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    class Particle {
        constructor(ox, oy, parent = 0, spin = 0) {
            this.x = ox;
            this.y = oy;
            this.r = radiusDistance;

            this.ox = ox;
            this.oy = oy;

            this.vr = 0.1;
            this.spin = spin;

            this.vs = 2;

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

            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                //particleArray.splice(particleArray.indexOf(this),1)
                return;
            }
            if (clickedOnScreen) {
                if (this.x - this.graze < mouseX && this.x + this.size + this.graze > mouseX && this.y - this.graze < mouseY && this.y + this.size + this.graze > mouseY) {
                    //console.log("graze")
                    grazeAudio.play();
                    this.color = `hsl(${this.parent * 20},50%,70%)`
                    if (gaeColor)
                    this.color = `hsl(${this.randomcolor},50%,70%)`;
                } else {
                    this.color = `hsl(${this.parent * 20},50%,50%)`
                    if (gaeColor)
                    this.color = `hsl(${this.randomcolor},50%,50%)`;
                }

                if (this.x < mouseX && this.x + this.size > mouseX && this.y < mouseY && this.y + this.size > mouseY) {
                    deathAudio.play();
                }
            }

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            let sinF = Math.sin(this.spin / 20) * 50;

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
        if (clickedOnScreen) {
            ctx.fillStyle = "#F00";
            ctx.fillRect(mouseX - 1, mouseY - 1, 2, 2);
        }
    }

    particleArray.push(new Particle(canvasOrigin, canvasOrigin, 0, 0));
    animate()
}

function onClickCanvas() {
    canvas.style.cursor = "none";
    clickedOnScreen = true;
    canvas.title = "";
}

function trackMouse(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
}

function stopTracking() {
    mouseX = -10;
    mouseY = -10;
}
function handleTail() {
    tailCount = document.getElementById("tailInput").value;
    radiusDistance = document.getElementById("radiusInput").value;
    gaeColor = document.getElementById("gaeInput").checked;
    cancelAnimationFrame(rafId)
    particleArray = [];
    onLoad()
}