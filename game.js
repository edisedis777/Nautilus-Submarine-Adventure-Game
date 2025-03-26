const gameState = {
  submarineX: 400,
  mapX: 400,
  mapY: 100,
  heading: 0,
  direction: 0,
  speed: 1,
  depth: 50,
  health: 100,
  oxygen: 100,
  morale: 50,
  distanceToCave: 0,
};

// Global slider references to fix potential undefined errors
const depthSlider = document.getElementById("depth-slider");
const speedSlider = document.getElementById("speed-slider");

const navCanvas = document.getElementById("navigation-deck");
const sideCanvas = document.getElementById("side-view");
const mapCanvas = document.getElementById("map-view");

// Validate canvas elements exist
if (!navCanvas || !sideCanvas || !mapCanvas) {
  console.error("One or more game canvases are missing!");
}

// Validate sliders exist
if (!depthSlider || !speedSlider) {
  console.error("One or more game sliders are missing!");
}

const navigationDeck = new NavigationDeck(navCanvas, gameState);
const sideView = new SideView(sideCanvas, gameState, depthSlider, speedSlider);
const mapView = new MapView(mapCanvas, gameState, navigationDeck.rocks);

function gameLoop() {
  try {
    // Calculate distance to cave more precisely
    gameState.distanceToCave = Math.sqrt(
      Math.pow(gameState.mapX - 700, 2) + Math.pow(gameState.mapY - 50, 2)
    );

    // Ensure game state stays within reasonable bounds
    gameState.health = Math.max(0, Math.min(100, gameState.health));
    gameState.oxygen = Math.max(0, Math.min(100, gameState.oxygen));
    gameState.morale = Math.max(0, Math.min(100, gameState.morale));
    gameState.depth = Math.max(0, Math.min(100, gameState.depth));
    gameState.speed = Math.max(0, Math.min(2, gameState.speed));

    navigationDeck.update();
    sideView.update();
    mapView.update();

    navigationDeck.draw();
    sideView.draw();
    mapView.draw();
  } catch (error) {
    console.error("Game loop error:", error);
    // Optionally reset game state if a critical error occurs
    Object.assign(gameState, {
      mapX: 400,
      mapY: 100,
      heading: 0,
      health: 100,
      oxygen: 100,
      morale: 50,
      depth: 50,
    });
  }
  requestAnimationFrame(gameLoop);
}

// Ensure game loop starts only after all game components are loaded
window.addEventListener("load", () => {
  try {
    gameLoop();
  } catch (error) {
    console.error("Failed to start game loop:", error);
  }
});
