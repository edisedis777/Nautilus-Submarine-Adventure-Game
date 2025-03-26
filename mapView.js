class MapView {
  constructor(canvas, gameState, rocks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gameState = gameState;
    this.rocks = rocks; // Array of rocks and the cave from NavigationDeck
    this.fogCanvas = document.createElement("canvas");
    this.fogCanvas.width = 800;
    this.fogCanvas.height = 200;
    this.fogCtx = this.fogCanvas.getContext("2d");
    this.fogCtx.fillStyle = "#555";
    this.fogCtx.fillRect(0, 0, 800, 200);
  }

  update() {
    const distance = Math.sqrt(
      Math.pow(this.gameState.mapX - 700, 2) +
        Math.pow(this.gameState.mapY - 50, 2)
    );

    if (distance < 20) {
      // More forgiving win condition
      alert("You've reached Santorini cave! You win!");
      this.resetGameState();
    }
  }

  resetGameState() {
    this.gameState.mapX = 400;
    this.gameState.mapY = 100;
    this.gameState.health = 100;
    this.gameState.oxygen = 100;
    this.gameState.morale = 50;
    this.gameState.depth = 50;
    this.fogCtx.fillStyle = "#555";
    this.fogCtx.fillRect(0, 0, 800, 200); // Reset fog-of-war
  }

  drawSubmarine(x, y) {
    // Draw a simple submarine shape as a triangle
    this.ctx.fillStyle = "#13e6f8";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 5); // Top point
    this.ctx.lineTo(x - 4, y + 5); // Bottom left
    this.ctx.lineTo(x + 4, y + 5); // Bottom right
    this.ctx.closePath();
    this.ctx.fill();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#003366";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw rocks and the cave
    this.rocks.forEach((rock) => {
      if (rock.type === "cave") {
        // Draw cave as a square instead of a circle
        this.ctx.fillStyle = "#ffcc00";
        this.ctx.fillRect(rock.mapX - 5, rock.mapY - 5, 10, 10);
      } else {
        // Draw other rocks as circles
        this.ctx.fillStyle = "#666";
        this.ctx.beginPath();
        this.ctx.arc(rock.mapX, rock.mapY, 5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Draw submarine marker as a triangle
    this.drawSubmarine(this.gameState.mapX, this.gameState.mapY);

    // Draw fog-of-war
    this.fogCtx.globalCompositeOperation = "destination-out";
    this.fogCtx.beginPath();
    this.fogCtx.arc(
      this.gameState.mapX,
      this.gameState.mapY,
      100,
      0,
      Math.PI * 2
    );
    this.fogCtx.fill();
    this.ctx.drawImage(this.fogCanvas, 0, 0);
  }
}
