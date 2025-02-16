class Ball {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvas, balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collision with other balls
        balls.forEach(ball => {
            if (ball === this) return; // Skip self

            // Calculate distance between ball centers
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if balls are colliding
            if (distance < this.radius + ball.radius) {
                // Collision detected - calculate new velocities
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = ball.dx * cos + ball.dy * sin;
                const vy2 = ball.dy * cos - ball.dx * sin;

                // Swap the velocities
                this.dx = vx2 * cos - vy1 * sin;
                this.dy = vy1 * cos + vx2 * sin;
                ball.dx = vx1 * cos - vy2 * sin;
                ball.dy = vy2 * cos + vx1 * sin;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                const moveX = overlap * cos;
                const moveY = overlap * sin;
                
                this.x -= moveX;
                this.y -= moveY;
                ball.x += moveX;
                ball.y += moveY;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;
    }
}

// Setup canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create balls with different colors
const balls = [
    new Ball(100, 100, 20, 'red', 5, 4),
    new Ball(200, 200, 20, 'blue', -4, 3),
    new Ball(300, 300, 20, 'green', 3, -4),
    new Ball(400, 400, 20, 'orange', -3, -3),
    new Ball(500, 500, 20, 'white', 4, 4),
    // Adding 4 more green balls with different positions and velocities
    new Ball(150, 150, 20, 'green', 4, 2),
    new Ball(250, 350, 20, 'green', -3, 5),
    new Ball(450, 250, 20, 'green', 2, -3),
    new Ball(350, 450, 20, 'green', -2, -4)
];

// Animation loop
function animate() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw balls
    balls.forEach(ball => {
        ball.update(canvas, balls);
        ball.draw(ctx);
    });

    // Request next frame
    requestAnimationFrame(animate);
}

// Start animation
animate(); 