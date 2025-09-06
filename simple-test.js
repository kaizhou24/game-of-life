// Ultra-simple test - just get something on screen
function setup() {
  console.log('🚀 Simple setup starting...');
  
  // Create canvas without WebGL first
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // Bright, obvious colors
  background(255, 0, 0); // Red background
  
  fill(0, 255, 0); // Green text
  textAlign(CENTER, CENTER);
  textSize(48);
  text('SIMPLE TEST', width/2, height/2);
  
  console.log('✅ Simple canvas created:', width, 'x', height);
}

function draw() {
  // Draw something that moves
  fill(0, 0, 255, 100); // Blue with transparency
  circle(mouseX, mouseY, 50);
}

function mousePressed() {
  // Clear and redraw
  background(255, 0, 0);
  fill(255, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('MOUSE CLICKED!', width/2, height/2);
}