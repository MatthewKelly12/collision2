// Initial Setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// Variables
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#FFA55E', '#E822DD', '#6B96FF', '#63E896','#FFF45E']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

// Objects
function Particle(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = randomColor(colors);
    this.mass = 1;
    this.opacity = 0;

    this.velocity = {
        x: Math.random() - 0.5 * 5,
        y: Math.random() - 0.5 * 5
    }

    this.update = particles => {
      this.draw()
        for (let i = 0; i < particles.length; i++) {
          if (this === particles[i]) continue;

            if (distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0)  {
                resolveCollision(this, particles[i])
                console.log("has collided")
            }
        }
        if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
            this.velocity.y = -this.velocity.y;
        }

        // Mouse Detection
        if (distance(mouse.x, mouse.y, this.x, this.y ) < 120 && this.opacity < .2) {
            this.opacity += .02;
            console.log("mouse")
        } else if (this.opacity > 0) {
            this.opacity -= .02;
            this.opacity = Math.max(0, this.opacity)
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }


    this.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
    }
}

// Implementation
let particles;
function init() {
    particles = [];

    for (let i = 0; i < 200; i++) {
        const radius = 15;
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);

        const color = "blue";

        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0)  {
                     x = randomIntFromRange(radius, canvas.width - radius);
                     y = randomIntFromRange(radius, canvas.height - radius);

                     j = -1;
                }
            }
        }

        particles.push(new Particle(x, y, radius, color))
    }
    // console.log(particles)
}


// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(
        function (particle) {
            // console.log(particle)
            particle.update(particles);

        }
    )

}

init()
animate()
