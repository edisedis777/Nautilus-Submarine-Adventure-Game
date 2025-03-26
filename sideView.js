class SideView {
  constructor(canvas, gameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gameState = gameState;
    this.depthSlider = depthSlider; // use depth slider
    this.speedSlider = speedSlider; // use speed slider

    // Load the pixel art sprite
    this.sprite = new Image();
    this.sprite.src = "nautilus-side-view.png";
    this.sprite.onload = () => {
      console.log("Side view sprite loaded");
      this.draw();
    };
    this.sprite.onerror = () => {
      console.error(
        "Failed to load nautilus-side-view.png. Check the file path or file integrity."
      );
    };

    // Define clickable areas for compartments
    this.compartments = [
      { name: "Captain", x: 91, y: 55, width: 110, height: 92 },
      { name: "Salon", x: 203, y: 55, width: 325, height: 92 },
      { name: "Engine", x: 530, y: 55, width: 130, height: 92 },
    ];

    // Add click event listener for compartment interaction
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      this.compartments.forEach((compartment) => {
        if (
          clickX >= compartment.x &&
          clickX <= compartment.x + compartment.width &&
          clickY >= compartment.y &&
          clickY <= compartment.y + compartment.height
        ) {
          if (compartment.name === "Captain") {
            alert(
              `Submarine Status:\n` +
                `Health: ${this.gameState.health}%\n` +
                `Oxygen: ${this.gameState.oxygen}%\n` +
                `Crew Morale: ${this.gameState.morale}%\n` +
                `Distance to Santorini Cave: ${Math.round(
                  this.gameState.distanceToCave
                )} units`
            );
          } else if (compartment.name === "Salon") {
            if (this.gameState.morale < 100) {
              this.gameState.morale = Math.min(100, this.gameState.morale + 10);
              this.gameState.health = Math.min(100, this.gameState.health + 5);
              alert(
                "The crew feels refreshed watching the ocean! Morale increased by 10%, and health increased by 5%."
              );
            } else {
              alert("The crew is already at peak morale!");
            }
          } else if (compartment.name === "Engine") {
            if (this.gameState.health < 100) {
              this.gameState.health = Math.min(100, this.gameState.health + 20);
              this.gameState.speed = Math.min(2, this.gameState.speed + 0.2);
              alert(
                "Engine repaired! Health increased by 20%, and speed increased temporarily."
              );
            } else {
              alert("The engine is already in perfect condition!");
            }
          }
        }
      });
    });
  }

  update() {
    // Deplete oxygen over time, faster at greater depths
    const depthFactor = 1 + this.gameState.depth / 100; // 1x at surface, 2x at max depth
    this.gameState.oxygen -= 0.01 * depthFactor;
    if (this.gameState.oxygen <= 0) {
      this.gameState.health -= 0.1;
      this.gameState.oxygen = 0;
    }

    // Morale affects health
    if (this.gameState.morale < 30) {
      this.gameState.health -= 0.05;
    }

    // Reset speed boost after a while (from engine repairs)
    if (this.gameState.speed > this.speedSlider.value) {
      this.gameState.speed = Math.max(
        parseFloat(this.speedSlider.value),
        this.gameState.speed - 0.001
      );
    }

    // Game over if health or oxygen reaches 0
    if (this.gameState.health <= 0 || this.gameState.oxygen <= 0) {
      alert("Game Over! The submarine has run out of health or oxygen.");
      this.gameState.health = 100;
      this.gameState.oxygen = 100;
      this.gameState.morale = 50;
      this.gameState.mapX = 400;
      this.gameState.mapY = 100;
      this.gameState.depth = 50; // Reset depth
      this.depthSlider.value = 50; // Reset depth slider
      this.speedSlider.value = 1; // Reset speed slider
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the sprite
    if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
      this.ctx.drawImage(
        this.sprite,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    } else {
      // Fallback if sprite isn't loaded
      this.ctx.fillStyle = "#003366";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "20px Arial";
      this.ctx.fillText("Loading Side View...", 20, 40);
    }

    // Draw clickable areas (for debugging, optional)
    this.compartments.forEach((compartment) => {
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.strokeRect(
        compartment.x,
        compartment.y,
        compartment.width,
        compartment.height
      );
    });

    // Display status indicators
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Oxygen: ${Math.round(this.gameState.oxygen)}%`, 10, 20);
    this.ctx.fillText(`Morale: ${Math.round(this.gameState.morale)}%`, 10, 40);
    this.ctx.fillText(`Depth: ${this.gameState.depth}`, 10, 60); // Added depth display
  }
}
