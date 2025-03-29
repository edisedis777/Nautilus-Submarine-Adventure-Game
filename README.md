# 🚢 Nautilus Submarine Adventure Game

## Overview

Nautilus is an interactive submarine exploration game where players navigate a submarine through challenging oceanic environments, managing resources, and attempting to reach the Santorini Cave.

![Screenshot](https://github.com/user-attachments/assets/4cda3517-f052-460c-956c-ef1794b8d12e)


## Game Mechanics

### Objective
Navigate your submarine to the Santorini Cave while managing:
- Health
- Oxygen levels
- Crew Morale
- Submarine Depth
- Navigation and Speed

### Controls
The game features three main sliders:
- **Depth Slider**: Control submarine depth from 0 to 100
- **Steering Slider**: Navigate left or right
- **Speed Slider**: Adjust submarine speed between 0 and 2

### Unique Features
- Dynamic Fog of War system
- Interactive submarine compartments
- Realistic depth and oxygen management
- Procedurally generated map with obstacles

## Gameplay Elements

### Navigation Deck
- Real-time heading display
- Obstacle and terrain visualization
- Health and depth indicators

### Side View
- Detailed submarine interior view
- Clickable compartments with unique interactions:
  - **Captain's Quarters**: View submarine status
  - **Salon**: Boost crew morale
  - **Engine Room**: Perform emergency repairs

### Map View
- Top-down map representation
- Submarine and obstacle tracking
- Fog of war mechanic revealing explored areas

## Technical Details

### Technologies Used
- JavaScript
- HTML5
- CSS3 for styling and layout

### Game Classes
- `NavigationDeck`: Manages game navigation and map generation
- `SideView`: Handles side-view rendering and compartment interactions
- `MapView`: Renders top-down map and tracks submarine position
- `Rock`: Represents map obstacles and the Santorini Cave


## Development

### Prerequisites
- Modern web browser
- Basic understanding of JavaScript

### Running the Game
Simply open the `index.html` file in your browser. No additional setup required.

## Gameplay Tips
- Manage your oxygen carefully
- Keep crew morale high
- Avoid obstacles
- Use compartment interactions strategically
- Monitor your health and depth

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap
- [ ] Add sound effects
- [ ] Implement difficulty levels
- [ ] Create more complex map generation

## Credits
- Inspired by Jules Verne.
- The Nautilus image was created by me with this tool: https://www.piskelapp.com/

## License
This project is open source. See the `LICENSE` file for details.
