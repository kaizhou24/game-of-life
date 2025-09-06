// Game of Life - Robust Shader Implementation
let golShader;
let prevFrame;
let isReady = false;

function setup() {
  console.log('🚀 Initializing Game of Life...');
  
  // Create canvas and attach to container
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  
  pixelDensity(1);
  noSmooth();
  
  // Test basic rendering first - this should be visible
  background(50, 100, 200);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Game of Life Loading...', 0, 0);
  
  console.log('📊 Canvas created:', width, 'x', height);
  console.log('🖼️  Canvas element:', canvas.canvas);
  
  // Initialize shader in next frame to ensure WebGL context is ready
  setTimeout(initializeShader, 500);
}

function initializeShader() {
  try {
    console.log('🔧 Compiling shaders...');
    golShader = createShader(VERTEX_SHADER, FRAGMENT_SHADER);
    console.log('✅ Shaders compiled successfully');
    
    // Create graphics buffer
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
    
    // Initialize with a test pattern
    background(0);
    stroke(255);
    strokeWeight(2);
    
    // Draw some initial cells
    for (let i = 0; i < 200; i++) {
      let x = random(-width/2, width/2);
      let y = random(-height/2, height/2);
      point(x, y);
    }
    
    isReady = true;
    console.log('🎮 Game of Life ready!');
    console.log('🖱️  Click and drag to draw');
    console.log('⌨️  Press SPACE for random pattern, C to clear');
    
  } catch (error) {
    console.error('❌ Shader compilation failed:', error);
    showError('Shader compilation failed: ' + error.message);
  }
}

function draw() {
  if (!isReady) {
    // Show loading state with bright colors so we know it's working
    background(100, 0, 200);
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Loading Game of Life...', 0, -40);
    textSize(20);
    text('Compiling GPU shaders...', 0, 20);
    textSize(16);
    text('Check console for progress', 0, 50);
    return;
  }
  
  // Handle mouse input for drawing
  if (mouseIsPressed) {
    stroke(255);
    strokeWeight(8);
    line(
      pmouseX - width/2, 
      pmouseY - height/2, 
      mouseX - width/2, 
      mouseY - height/2
    );
  }
  
  // Apply Game of Life shader
  try {
    // Copy current frame to buffer
    prevFrame.image(get(), 0, 0);
    
    // Apply shader
    shader(golShader);
    golShader.setUniform('tex', prevFrame);
    golShader.setUniform('normalRes', [1.0/width, 1.0/height]);
    
    // Render full screen quad
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, width, height);
    
  } catch (error) {
    console.error('❌ Render error:', error);
    showError('Render error: ' + error.message);
    isReady = false;
  }
}

function showError(message) {
  background(60, 20, 20);
  fill(255, 150, 150);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('Error: ' + message, 0, 0);
  textSize(14);
  text('Check console for details', 0, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (isReady && prevFrame) {
    // Recreate graphics buffer
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
  }
}

// Mouse interaction
function mousePressed() {
  if (!isReady) return;
  
  stroke(255);
  strokeWeight(6);
  point(mouseX - width/2, mouseY - height/2);
}

// Keyboard controls
function keyPressed() {
  if (!isReady) return;
  
  if (key === ' ') {
    // Generate random pattern
    background(0);
    stroke(255);
    strokeWeight(2);
    
    console.log('🎲 Generating random pattern...');
    for (let i = 0; i < 800; i++) {
      let x = random(-width/2, width/2);
      let y = random(-height/2, height/2);
      point(x, y);
    }
  }
  
  if (key === 'c' || key === 'C') {
    // Clear canvas
    background(0);
    console.log('🧹 Canvas cleared');
  }
  
  if (key === 'r' || key === 'R') {
    // Restart
    console.log('🔄 Restarting...');
    isReady = false;
    setTimeout(initializeShader, 100);
  }
}