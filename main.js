let golShader;
let prevFrame;
let isReady = false;
let skipBufferUpdate = false;

function setup() {
  // Get actual viewport dimensions
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  
  console.log('📏 Viewport dimensions:', vw, 'x', vh);
  console.log('🖼️ Window dimensions:', window.innerWidth, 'x', window.innerHeight);
  console.log('📄 Document dimensions:', document.documentElement.clientWidth, 'x', document.documentElement.clientHeight);
  
  // Create canvas with maximum dimensions
  let canvas = createCanvas(vw, vh, WEBGL);
  canvas.parent('canvas-container');
  
  // Force canvas element to full screen via style
  canvas.canvas.style.position = 'fixed';
  canvas.canvas.style.top = '0px';
  canvas.canvas.style.left = '0px';
  canvas.canvas.style.width = '100vw';
  canvas.canvas.style.height = '100vh';
  canvas.canvas.style.zIndex = '1';
  
  pixelDensity(1);
  noSmooth();
  
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text('Loading...', 0, 0);
  
  console.log('✅ Canvas created and styled for full screen');
  
  setTimeout(initializeShader, 100);
}

function initializeShader() {
  try {
    console.log('🔧 Compiling shaders...');
    golShader = createShader(VERTEX_SHADER, FRAGMENT_SHADER);
    console.log('✅ Shaders compiled');
    
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
    console.log('📊 Graphics buffer created:', width, 'x', height);
    
    isReady = true;
    background(0);
    
    // Generate some initial random cells
    generateInitialCells();
    
    console.log('🎮 Game of Life ready!');
    
  } catch (error) {
    console.error('Shader compilation failed:', error);
    showError('Shader compilation failed: ' + error.message);
  }
}

function draw() {
  if (!isReady) {
    background(20);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text('Loading...', 0, 0);
    return;
  }
  
  if (mouseIsPressed) {
    stroke(255);
    strokeWeight(6);
    line(
      pmouseX - width/2, 
      pmouseY - height/2, 
      mouseX - width/2, 
      mouseY - height/2
    );
  }
  
  try {
    if (!skipBufferUpdate) {
      prevFrame.image(get(), 0, 0);
    }
    
    shader(golShader);
    golShader.setUniform('tex', prevFrame);
    golShader.setUniform('normalRes', [1.0/width, 1.0/height]);
    
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, width, height);
    
  } catch (error) {
    console.error('Render error:', error);
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
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  
  resizeCanvas(vw, vh);
  console.log('📐 Canvas resized to:', vw, 'x', vh);
  
  // Re-apply full screen styling
  let canvas = document.getElementById('defaultCanvas0');
  if (canvas) {
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '1';
  }
  
  if (isReady && prevFrame) {
    // Recreate graphics buffer
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
    
    // Regenerate initial cells for new size
    generateInitialCells();
  }
}

// Mouse interaction
function mousePressed() {
  if (!isReady) return;
  
  stroke(255);
  strokeWeight(6);
  point(mouseX - width/2, mouseY - height/2);
}









function generateInitialCells() {
  console.log('🎲 Generating random cells in center circle...');
  console.log('📊 Buffer size:', prevFrame.width, 'x', prevFrame.height);
  
  let cellSize = 4;
  let gridWidth = Math.floor(prevFrame.width / cellSize);
  let gridHeight = Math.floor(prevFrame.height / cellSize);
  
  // Calculate circle parameters (30% of canvas height)
  let radius = (prevFrame.height * 0.3) / cellSize; // Convert to grid units
  let centerX = gridWidth / 2;
  let centerY = gridHeight / 2;
  
  console.log('🎯 Grid dimensions:', gridWidth, 'x', gridHeight, 'cells');
  console.log('⭕ Circle: center(', Math.round(centerX), ',', Math.round(centerY), ') radius:', Math.round(radius), 'cells');
  
  // Draw random cells directly to the shader buffer
  prevFrame.fill(255);
  prevFrame.noStroke();
  
  let aliveCount = 0;
  let totalInCircle = 0;
  
  // Generate random cells only within the circle
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      // Check if cell is within the circle
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= radius) {
        totalInCircle++;
        if (random() < 0.5) { // 50% chance for each cell in circle
          let pixelX = x * cellSize;
          let pixelY = y * cellSize;
          prevFrame.rect(pixelX, pixelY, cellSize, cellSize);
          aliveCount++;
        }
      }
    }
  }
  
  // Also draw to main canvas for immediate visibility
  fill(255);
  noStroke();
  
  let mainGridWidth = Math.floor(width / cellSize);
  let mainGridHeight = Math.floor(height / cellSize);
  let mainRadius = (height * 0.3) / cellSize;
  let mainCenterX = mainGridWidth / 2;
  let mainCenterY = mainGridHeight / 2;
  
  for (let x = 0; x < mainGridWidth; x++) {
    for (let y = 0; y < mainGridHeight; y++) {
      // Check if cell is within the circle
      let dx = x - mainCenterX;
      let dy = y - mainCenterY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= mainRadius && random() < 0.5) {
        let pixelX = (x * cellSize) - width/2;
        let pixelY = (y * cellSize) - height/2;
        rect(pixelX, pixelY, cellSize, cellSize);
      }
    }
  }
  
  console.log('✅ Generated', aliveCount, 'alive cells out of', totalInCircle, 'cells in circle');
  console.log('📈 Alive percentage:', Math.round((aliveCount / totalInCircle) * 100) + '%');
  console.log('🔵 Circle covers', Math.round((totalInCircle / (gridWidth * gridHeight)) * 100) + '% of total grid');
}

function clearCanvas() {
  background(0);
  prevFrame.clear();
  prevFrame.background(0);
}

function keyPressed() {
  if (!isReady) return;
  
  if (key === 'c' || key === 'C') {
    clearCanvas();
  }
}