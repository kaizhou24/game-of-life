let golShader;
let prevFrame;
let isReady = false;
let skipBufferUpdate = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  
  pixelDensity(1);
  noSmooth();
  
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text('Loading...', 0, 0);
  
  setTimeout(initializeShader, 100);
}

function initializeShader() {
  try {
    golShader = createShader(VERTEX_SHADER, FRAGMENT_SHADER);
    
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
    
    isReady = true;
    background(0);
    
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