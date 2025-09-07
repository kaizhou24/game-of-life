const VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition * 2.0 - 1.0, 1.0);
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
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
  
  float current = step(0.5, texture2D(tex, uv).r);
  
  float neighbors = 
    step(0.5, texture2D(tex, mod(uv + vec2(-normalRes.x, -normalRes.y), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(0.0, -normalRes.y), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(normalRes.x, -normalRes.y), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(-normalRes.x, 0.0), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(normalRes.x, 0.0), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(-normalRes.x, normalRes.y), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(0.0, normalRes.y), 1.0)).r) +
    step(0.5, texture2D(tex, mod(uv + vec2(normalRes.x, normalRes.y), 1.0)).r);
  
  float alive = (current > 0.5 && (neighbors == 2.0 || neighbors == 3.0)) ||
                (current < 0.5 && neighbors == 3.0) ? 1.0 : 0.0;
  
  gl_FragColor = vec4(alive, alive, alive, 1.0);
}
`;