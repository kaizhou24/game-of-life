// Game of Life Shaders - Direct implementation
const VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D tex;
uniform vec2 normalRes;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  // Sample current cell
  vec4 col = texture2D(tex, uv);
  float currentCell = step(0.5, col.r); // Clean threshold - exactly 0.0 or 1.0
  
  // Count neighbors
  float neighbors = 0.0;
  for(float i = -1.0; i <= 1.0; i++) {
    for(float j = -1.0; j <= 1.0; j++) {
      if(i == 0.0 && j == 0.0) continue; // Skip center cell
      
      vec2 offset = vec2(i * normalRes.x, j * normalRes.y);
      vec2 neighborUV = uv + offset;
      
      // Wrap edges properly
      neighborUV = mod(neighborUV, 1.0);
      
      float neighborCell = step(0.5, texture2D(tex, neighborUV).r);
      neighbors += neighborCell;
    }
  }
  
  // Apply Conway's Game of Life rules - clean binary logic
  float nextState = 0.0;
  
  if(currentCell > 0.5) {
    // Living cell: survives with 2 or 3 neighbors
    if(neighbors >= 1.5 && neighbors <= 3.5) {
      nextState = 1.0;
    }
  } else {
    // Dead cell: becomes alive with exactly 3 neighbors
    if(neighbors >= 2.5 && neighbors <= 3.5) {
      nextState = 1.0;
    }
  }
  
  // Output pure black or white - no gray values
  gl_FragColor = vec4(nextState, nextState, nextState, 1.0);
}
`;