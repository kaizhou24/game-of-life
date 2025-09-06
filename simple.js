// Simplified Game of Life test
let golShader;
let prevFrame;
let isWebGLSupported = false;

function setup() {
  console.log('🚀 Starting setup...');
  
  // Try to create WebGL canvas
  try {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('canvas-container');
    isWebGLSupported = true;
    console.log('✅ WebGL canvas created');
  } catch(e) {
    console.error('❌ WebGL failed, falling back to 2D:', e);
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    isWebGLSupported = false;
  }
  
  if (isWebGLSupported) {
    setupWebGL();
  } else {
    setup2D();
  }
}

function setupWebGL() {
  pixelDensity(1);
  noSmooth();
  
  try {
    golShader = createShader(VERTEX_SHADER, FRAGMENT_SHADER);
    console.log('✅ Shader compiled');
    
    prevFrame = createGraphics(width, height);
    prevFrame.pixelDensity(1);
    prevFrame.noSmooth();
    
    // Initial pattern
    background(0);
    stroke(255);
    strokeWeight(2);
    for (let i = 0; i < 100; i++) {
      point(random(-width/2, width/2), random(-height/2, height/2));
    }
    
    console.log('🎮 WebGL Game of Life ready!');
  } catch(e) {
    console.error('❌ Shader setup failed:', e);
    isWebGLSupported = false;
    setup2D();
  }
}

function setup2D() {
  background(50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text('WebGL not supported - 2D fallback', width/2, height/2);
  console.log('📱 Running in 2D mode');
}

function draw() {
  if (!isWebGLSupported) {
    // 2D fallback - just show a message
    return;
  }
  
  if (!golShader) {
    background(100, 0, 0);
    fill(255);
    textAlign(CENTER, CENTER);
    text('Shader loading...', 0, 0);
    return;
  }
  
  // Mouse drawing
  if (mouseIsPressed) {
    stroke(255);
    strokeWeight(4);
    line(pmouseX - width/2, pmouseY - height/2, mouseX - width/2, mouseY - height/2);
  }
  
  // Game of Life shader
  prevFrame.image(get(), 0, 0);
  shader(golShader);
  golShader.setUniform('tex', prevFrame);
  golShader.setUniform('normalRes', [1.0/width, 1.0/height]);
  
  fill(255);
  noStroke();
  rect(-width/2, -height/2, width, height);
}

function keyPressed() {
  if (!isWebGLSupported) return;
  
  if (key === ' ') {
    background(0);
    stroke(255);
    for (let i = 0; i < 500; i++) {
      point(random(-width/2, width/2), random(-height/2, height/2));
    }
  }
  if (key === 'c') {
    background(0);
  }
}