class Rock {
  constructor(x, y, type = "rock") {
    this.mapX = x;
    this.mapY = y;
    this.type = type;
    this.baseViewRange = 400; // Base view range at surface
    this.height = Math.random() * 100 + 50; // Random height between 50-150
  }

  getWindowPosition(submarineX, submarineY, heading, depth) {
    const dx = this.mapX - submarineX;
    const dy = this.mapY - submarineY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Adjust view range based on depth (0 = surface, 100 = max depth)
    const viewRange = this.baseViewRange * (1 - depth / 200); // Deeper = less visibility
    if (distance > viewRange) return null;

    const angleToRock = Math.atan2(dy, dx) * (180 / Math.PI);
    let relativeAngle = angleToRock - heading;
    if (relativeAngle < -180) relativeAngle += 360;
    if (relativeAngle > 180) relativeAngle -= 360;

    // Calculate x position across the entire canvas width
    const canvasWidth = 800;
    const centerX = canvasWidth / 2;
    const windowX = centerX + (relativeAngle / 180) * (canvasWidth / 2);

    // Vertical positioning
    let windowY = 300; // Centered vertically
    if (this.type === "cave") {
      windowY = 250 + (distance / viewRange) * 100;
    }

    return { window: "main", x: windowX, y: windowY, distance };
  }

  draw(ctx, window, x, y, distance, viewRange) {
    const maxSize = 30;
    const minSize = 5;
    const size = minSize + (maxSize - minSize) * (1 - distance / viewRange);

    if (this.type === "cave") {
      ctx.fillStyle = "#ffcc00";
    } else {
      ctx.fillStyle = "#666";
    }
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class NavigationDeck {
  constructor(canvas, gameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gameState = gameState;

    // Scatter rocks across the map
    this.rocks = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 200;
      this.rocks.push(new Rock(x, y));
    }

    // Add the Santorini cave
    this.rocks.push(new Rock(700, 50, "cave")); // Santorini cave
    this.rocks.push(new Rock(400, 100, "rock")); // Rock at starting position

    // Navigation slider
    this.navSlider = document.getElementById("nav-slider");
    if (!this.navSlider) console.error("Navigation slider not found");
    this.navSlider.addEventListener("input", () => {
      this.gameState.direction = (parseInt(this.navSlider.value) / 100) * 2;
    });
    this.navSlider.addEventListener("mouseup", () => {
      this.navSlider.value = 0;
      this.gameState.direction = 0;
    });
    this.navSlider.addEventListener("touchend", () => {
      this.navSlider.value = 0;
      this.gameState.direction = 0;
    });

    // Depth slider
    this.depthSlider = document.getElementById("depth-slider");
    if (!this.depthSlider) console.error("Depth slider not found");
    this.depthSlider.addEventListener("input", () => {
      this.gameState.depth = parseInt(this.depthSlider.value);
    });

    // Speed slider
    this.speedSlider = document.getElementById("speed-slider");
    if (!this.speedSlider) console.error("Speed slider not found");
    this.speedSlider.addEventListener("input", () => {
      this.gameState.speed = parseFloat(this.speedSlider.value);
    });
  }

  update() {
    // Update heading based on direction
    this.gameState.heading += this.gameState.direction * 2;
    if (this.gameState.heading < 0) this.gameState.heading += 360;
    if (this.gameState.heading >= 360) this.gameState.heading -= 360;

    // Update submarine position for map movement
    const angle = (this.gameState.heading * Math.PI) / 180;
    this.gameState.mapX += Math.cos(angle) * this.gameState.speed;
    this.gameState.mapY += Math.sin(angle) * this.gameState.speed;

    this.gameState.mapX = Math.max(0, Math.min(800, this.gameState.mapX));
    this.gameState.mapY = Math.max(0, Math.min(200, this.gameState.mapY));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw single large window
    this.ctx.fillStyle = "#003366";
    this.ctx.strokeStyle = "#A54B0F";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.rect(0, 100, 800, 300);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw heading indicator
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(320, 2, 160, 40);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "28px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `Heading: ${Math.round(this.gameState.heading)}`,
      400,
      30
    );

    // Draw rocks and cave
    const viewRange =
      this.rocks[0].baseViewRange * (1 - this.gameState.depth / 200);
    this.rocks.forEach((rock) => {
      const pos = rock.getWindowPosition(
        this.gameState.mapX,
        this.gameState.mapY,
        this.gameState.heading,
        this.gameState.depth
      );
      if (pos) {
        rock.draw(this.ctx, pos.window, pos.x, pos.y, pos.distance, viewRange);
      }
    });

    // Draw health, depth, and speed
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Health: ${this.gameState.health}`, 10, 20);
    this.ctx.fillText(`Depth: ${this.gameState.depth}`, 10, 40);
    this.ctx.fillText(`Speed: ${this.gameState.speed.toFixed(1)}`, 10, 60);
  }
}
