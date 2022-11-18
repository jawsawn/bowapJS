let canvas;
let ctx;
let rafId;
let particleArray = [];
let mouseX = 0;
let mouseY = 0;
const deathAudio = new Audio('death.mp3');
const grazeAudio = new Audio('graze.mp3');

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
            this.r = 0;

            this.ox = ox;
            this.oy = oy;

            this.vr = 0.1;
            this.spin = spin;

            this.vs = 2;

            this.parent = parent;

            this.size = 8;
            this.graze = 4;
            this.color = `hsl(${this.parent * 20},50%,50%)`;
            //this.color = `hsl(${Math.floor(Math.random() * 360)},50%,50%)`;

        }

        draw() {

            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                //particleArray.splice(particleArray.indexOf(this),1)
                return;
            }
            
            if(this.x - this.graze < mouseX && this.x + this.size + this.graze > mouseX && this.y- this.graze < mouseY && this.y + this.size +this.graze >mouseY) {
                //console.log("graze")
                grazeAudio.pause();
                grazeAudio.play();
            }

            if(this.x < mouseX && this.x + this.size > mouseX && this.y < mouseY && this.y + this.size >mouseY) {
                deathAudio.play();
            }


            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            let sinF = Math.sin(this.spin / 20) * 50;

            if (this.parent == 0) {
                this.x = this.ox + this.r * Math.cos(this.spin)
                this.y = this.oy + this.r * Math.sin(this.spin)
                this.spin += this.vr;
            }
            if (this.parent == 1) {
                this.x += this.vs * Math.cos(sinF);
                this.y += this.vs * Math.sin(sinF);
            }
            if (this.parent == 2) {
                this.x += this.vs * Math.cos(sinF + Math.PI);
                this.y += this.vs * Math.sin(sinF + Math.PI);
            }
            if (this.parent == 3) {
                this.x += this.vs * Math.cos(sinF + 0.5 * Math.PI);
                this.y += this.vs * Math.sin(sinF + 0.5 * Math.PI);
            }
            if (this.parent == 4) {
                this.x += this.vs * Math.cos(sinF + 1.5 * Math.PI);
                this.y += this.vs * Math.sin(sinF + 1.5 * Math.PI);
            }

            if (this.parent == 0) {
                particleArray.push(new Particle(this.x, this.y, 1, this.spin));
                particleArray.push(new Particle(this.x, this.y, 2, this.spin));
                //particleArray.push(new Particle(this.x, this.y, 3, this.spin));
                //particleArray.push(new Particle(this.x, this.y, 4, this.spin));
            }


        }
    }

    function animate() {
        rafId = requestAnimationFrame(animate)
        //animation below
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        particleArray.forEach(e => e.draw())
    }

    particleArray.push(new Particle(canvasOrigin, canvasOrigin));
    animate()
}

function canvasMove(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
  }
