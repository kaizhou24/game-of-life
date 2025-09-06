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
    
    isReady = true;
    
    // Initialize with fractal pattern after a brief delay
    setTimeout(() => {
      background(0);
      generateSierpinskiTriangle();
    }, 100);
    console.log('🎮 Game of Life with Fractals ready!');
    console.log('🖱️  Click and drag to draw');
    console.log('🔢 Press 1-7 for specific fractals:');
    console.log('   1: Sierpinski Triangle 🔺');
    console.log('   2: Mandelbrot Set 🌀');
    console.log('   3: Dragon Curve 🐉');
    console.log('   4: Koch Snowflake ❄️');
    console.log('   5: Julia Set 🌸');
    console.log('   6: Barnsley Fern 🌿');
    console.log('   7: Game of Life Patterns 🎮');
    console.log('⌨️  SPACE: Random fractal, C: Clear, R: Restart');
    
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

// Fractal generation functions
function generateSierpinskiTriangle() {
  stroke(255);
  strokeWeight(1);
  
  let size = min(width, height) * 0.6;
  let centerX = 0;
  let centerY = 0;
  
  // Sierpinski triangle using chaos game
  let points = [
    [centerX, centerY - size/2],           // Top vertex
    [centerX - size/2, centerY + size/2],  // Bottom left
    [centerX + size/2, centerY + size/2]   // Bottom right
  ];
  
  let current = [random(-width/4, width/4), random(-height/4, height/4)];
  
  for (let i = 0; i < 15000; i++) {
    let target = random(points);
    current[0] = (current[0] + target[0]) / 2;
    current[1] = (current[1] + target[1]) / 2;
    
    if (i > 100) { // Skip first iterations
      point(current[0], current[1]);
    }
  }
  
  console.log('🔺 Generated Sierpinski Triangle');
}

function generateMandelbrotSet() {
  stroke(255);
  strokeWeight(4);
  
  // Simplified but highly recognizable Mandelbrot
  let zoom = 150;
  let maxIterations = 50;
  let spacing = 10;
  let offsetX = 60;
  let offsetY = 0;
  
  console.log('🌀 Starting ultra-defined Mandelbrot generation...');
  
  let patternCount = 0;
  
  // Direct drawing approach - same as Dragon Curve
  for (let x = -width/2; x < width/2; x += spacing) {
    for (let y = -height/2; y < height/2; y += spacing) {
      let c_re = (x - offsetX) / zoom;
      let c_im = (y - offsetY) / zoom;
      let z_re = 0, z_im = 0;
      let iteration = 0;
      
      while (iteration < maxIterations && z_re*z_re + z_im*z_im <= 4) {
        let temp = z_re*z_re - z_im*z_im + c_re;
        z_im = 2*z_re*z_im + c_im;
        z_re = temp;
        iteration++;
      }
      
      // Focus on boundary - escape time 8-45 for clear Mandelbrot shape
      if (iteration >= 8 && iteration <= 45) {
        patternCount++;
        
        // Draw simple lines like Dragon Curve does
        let size = 6;
        line(x - size, y, x + size, y);  // Horizontal line
        line(x, y - size, x, y + size);  // Vertical line
      }
    }
  }
  
  console.log(`🌀 Generated ${patternCount} ultra-defined Mandelbrot patterns`);
}

function generateDragonCurve() {
  stroke(255);
  strokeWeight(2);
  
  let sequence = "F";
  let generations = 14;
  
  // Generate L-system string
  for (let i = 0; i < generations; i++) {
    let next = "";
    for (let j = 0; j < sequence.length; j++) {
      if (sequence[j] === 'F') {
        next += "F+G";
      } else if (sequence[j] === 'G') {
        next += "F-G";
      } else {
        next += sequence[j];
      }
    }
    sequence = next;
  }
  
  // Draw the curve - centered
  let x = 0, y = 0;
  let angle = 0;
  let step = 2;
  
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] === 'F' || sequence[i] === 'G') {
      let newX = x + cos(angle) * step;
      let newY = y + sin(angle) * step;
      line(x, y, newX, newY);
      x = newX;
      y = newY;
    } else if (sequence[i] === '+') {
      angle += PI/2;
    } else if (sequence[i] === '-') {
      angle -= PI/2;
    }
  }
  
  console.log('🐉 Generated Dragon Curve');
}

function generateKochSnowflake() {
  stroke(255);
  strokeWeight(2);
  
  let size = min(width, height) * 0.3;
  let centerX = 0, centerY = 0;
  
  // Three sides of the triangle
  let points = [
    [centerX, centerY - size],
    [centerX + size * cos(PI/6), centerY + size * sin(PI/6)],
    [centerX - size * cos(PI/6), centerY + size * sin(PI/6)]
  ];
  
  for (let i = 0; i < 3; i++) {
    let start = points[i];
    let end = points[(i + 1) % 3];
    drawKochLine(start[0], start[1], end[0], end[1], 4);
  }
  
  console.log('❄️ Generated Koch Snowflake');
}

function drawKochLine(x1, y1, x2, y2, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2);
  } else {
    let dx = x2 - x1;
    let dy = y2 - y1;
    
    let xa = x1 + dx / 3;
    let ya = y1 + dy / 3;
    let xb = x1 + 2 * dx / 3;
    let yb = y1 + 2 * dy / 3;
    
    let xc = xa + (xb - xa) * cos(-PI/3) - (yb - ya) * sin(-PI/3);
    let yc = ya + (xb - xa) * sin(-PI/3) + (yb - ya) * cos(-PI/3);
    
    drawKochLine(x1, y1, xa, ya, depth - 1);
    drawKochLine(xa, ya, xc, yc, depth - 1);
    drawKochLine(xc, yc, xb, yb, depth - 1);
    drawKochLine(xb, yb, x2, y2, depth - 1);
  }
}

function generateJuliaSet() {
  stroke(255);
  strokeWeight(6);
  
  let zoom = 200;
  let maxIterations = 25;
  let c_re = -0.7, c_im = 0.27015;
  let spacing = 12;
  
  console.log('🌸 Starting Julia generation...');
  
  let patternCount = 0;
  for (let x = -width/2; x < width/2; x += spacing) {
    for (let y = -height/2; y < height/2; y += spacing) {
      let z_re = x / zoom;
      let z_im = y / zoom;
      let iteration = 0;
      
      while (iteration < maxIterations && z_re*z_re + z_im*z_im <= 4) {
        let temp = z_re*z_re - z_im*z_im + c_re;
        z_im = 2*z_re*z_im + c_im;
        z_re = temp;
        iteration++;
      }
      
      // More lenient conditions
      if (iteration > 2 && iteration < maxIterations - 1) {
        patternCount++;
        
        // Draw simple patterns using points
        if (iteration % 2 === 0) {
          // 2x2 block
          point(x, y);
          point(x + 4, y);
          point(x, y + 4);
          point(x + 4, y + 4);
        } else {
          // 3-cell blinker
          point(x, y);
          point(x, y + 4);
          point(x, y + 8);
        }
      }
    }
  }
  
  console.log(`🌸 Generated ${patternCount} Julia patterns`);
}

function generateBarnsleyFern() {
  stroke(255);
  strokeWeight(1);
  
  let x = 0, y = 0;
  let scale = height / 15;
  let points = [];
  
  // Generate points first
  for (let i = 0; i < 50000; i++) {
    let r = random();
    let nextX, nextY;
    
    if (r < 0.01) {
      nextX = 0;
      nextY = 0.16 * y;
    } else if (r < 0.86) {
      nextX = 0.85 * x + 0.04 * y;
      nextY = -0.04 * x + 0.85 * y + 1.6;
    } else if (r < 0.93) {
      nextX = 0.2 * x - 0.26 * y;
      nextY = 0.23 * x + 0.22 * y + 1.6;
    } else {
      nextX = -0.15 * x + 0.28 * y;
      nextY = 0.26 * x + 0.24 * y + 0.44;
    }
    
    if (i > 100) {
      points.push([nextX * scale, -nextY * scale + height/4]);
    }
    
    x = nextX;
    y = nextY;
  }
  
  // Draw sparse selection to avoid overcrowding
  for (let i = 0; i < points.length; i += 3) {
    if (random() > 0.8) { // Only 20% of points
      point(points[i][0], points[i][1]);
    }
  }
  
  console.log('🌿 Generated Sparse Barnsley Fern');
}

function generateGameOfLifeFractals() {
  stroke(255);
  strokeWeight(2);
  
  // Gosper Glider Gun - classic Game of Life pattern
  let gliderGun = [
    [1,5],[1,6],[2,5],[2,6],[11,5],[11,6],[11,7],[12,4],[12,8],[13,3],
    [13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],
    [21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],
    [25,6],[25,7],[35,3],[35,4],[36,3],[36,4]
  ];
  
  let scale = 8;
  let offsetX = -width/3;
  let offsetY = -height/3;
  
  for (let cell of gliderGun) {
    let x = offsetX + cell[0] * scale;
    let y = offsetY + cell[1] * scale;
    rect(x, y, scale-1, scale-1);
  }
  
  // Add some scattered gliders
  for (let i = 0; i < 8; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    drawGlider(x, y, scale/2);
  }
  
  // Add some blinkers and blocks
  for (let i = 0; i < 15; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    if (random() > 0.5) {
      drawBlinker(x, y, scale/3);
    } else {
      drawBlock(x, y, scale/3);
    }
  }
  
  console.log('🎮 Generated Game of Life Fractals');
}

function drawGlider(x, y, size) {
  // Classic glider pattern
  rect(x + size, y, size, size);
  rect(x + 2*size, y + size, size, size);
  rect(x, y + 2*size, size, size);
  rect(x + size, y + 2*size, size, size);
  rect(x + 2*size, y + 2*size, size, size);
}

function drawBlinker(x, y, size) {
  // 3-cell blinker
  rect(x, y, size, size);
  rect(x, y + size, size, size);
  rect(x, y + 2*size, size, size);
}

function drawBlock(x, y, size) {
  // 2x2 stable block
  rect(x, y, size, size);
  rect(x + size, y, size, size);
  rect(x, y + size, size, size);
  rect(x + size, y + size, size, size);
}

function drawBeacon(x, y, size) {
  // Beacon - period-2 oscillator
  rect(x, y, size, size);
  rect(x + size, y, size, size);
  rect(x, y + size, size, size);
  rect(x + 3*size, y + 2*size, size, size);
  rect(x + 2*size, y + 3*size, size, size);
  rect(x + 3*size, y + 3*size, size, size);
}

function drawToad(x, y, size) {
  // Toad - period-2 oscillator
  rect(x + size, y, size, size);
  rect(x + 2*size, y, size, size);
  rect(x + 3*size, y, size, size);
  rect(x, y + size, size, size);
  rect(x + size, y + size, size, size);
  rect(x + 2*size, y + size, size, size);
}

function drawPulsar(x, y, size) {
  // Simplified pulsar pattern
  let positions = [
    [2,0],[3,0],[4,0],[8,0],[9,0],[10,0],
    [0,2],[5,2],[7,2],[12,2],
    [0,3],[5,3],[7,3],[12,3],
    [0,4],[5,4],[7,4],[12,4],
    [2,5],[3,5],[4,5],[8,5],[9,5],[10,5]
  ];
  
  for (let pos of positions) {
    rect(x + pos[0]*size, y + pos[1]*size, size, size);
  }
}

function drawBeehive(x, y, size) {
  // Beehive - stable pattern
  rect(x + size, y, size, size);
  rect(x + 2*size, y, size, size);
  rect(x, y + size, size, size);
  rect(x + 3*size, y + size, size, size);
  rect(x + size, y + 2*size, size, size);
  rect(x + 2*size, y + 2*size, size, size);
}

function drawLoaf(x, y, size) {
  // Loaf - stable pattern
  rect(x + size, y, size, size);
  rect(x + 2*size, y, size, size);
  rect(x, y + size, size, size);
  rect(x + 3*size, y + size, size, size);
  rect(x, y + 2*size, size, size);
  rect(x + 2*size, y + 2*size, size, size);
  rect(x + size, y + 3*size, size, size);
}

// Keyboard controls with fractal options
function keyPressed() {
  if (!isReady) return;
  
  if (key === '1') {
    background(0);
    generateSierpinskiTriangle();
  }
  
  if (key === '2') {
    background(0);
    generateMandelbrotSet();
  }
  
  if (key === '3') {
    background(0);
    generateDragonCurve();
  }
  
  if (key === '4') {
    background(0);
    generateKochSnowflake();
  }
  
  if (key === '5') {
    background(0);
    generateJuliaSet();
  }
  
  if (key === '6') {
    background(0);
    generateBarnsleyFern();
  }
  
  if (key === '7') {
    background(0);
    generateGameOfLifeFractals();
  }
  
  if (key === ' ') {
    // Cycle through fractals randomly
    background(0);
    let fractals = [
      generateSierpinskiTriangle,
      generateMandelbrotSet, 
      generateDragonCurve,
      generateKochSnowflake,
      generateJuliaSet,
      generateBarnsleyFern,
      generateGameOfLifeFractals
    ];
    random(fractals)();
  }
  
  if (key === 'c' || key === 'C') {
    background(0);
    console.log('🧹 Canvas cleared');
  }
  
  if (key === 'r' || key === 'R') {
    console.log('🔄 Restarting...');
    isReady = false;
    setTimeout(initializeShader, 100);
  }
}