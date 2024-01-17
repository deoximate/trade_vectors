#include <commonMain>
#include <chank>

uniform vec2 uPlaneSize;
uniform float uLinesCount;
uniform float uLinesCountS;

out vec4 vColor;
out vec2 vUv;
out float vInstanceID;
out vec2 vXY;
out vec3 vPos;
out float vD;

vec2 rotate2D(vec2 point, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    return rotationMatrix * point;
}

void main() {
  vec3 ps = position;

  float SIZE = 1.0/uLinesCountS;
  vec2 OFFSET = vec2(SIZE, SIZE);

  float idx = float(gl_InstanceID);
  float x = mod(idx, uLinesCountS);
  float y = floor(idx / uLinesCountS);



  //! UV & MAPS
  vec2 uvMap = vec2(vec2(x, y)/uLinesCountS);
  vec4 map = texture(bufferA, uvMap);



  //! ROTATION
  vec2 norm = normalize(map.rg);
  float d = length(norm.rg);
  float angle = atan(norm.r, norm.g);


  ps.xy -= vec2(0.5, 0.5);
  ps.xy = rotate2D(ps.xy, angle);
  ps.xy += vec2(0.5, 0.5);

  //! POSITION
  vec3 pos = vec3(ps.x*SIZE, ps.y*SIZE, 0.0);
  pos.xy += vec2(x*OFFSET.x, y*OFFSET.y)-0.5;





  //vColor = map;


  vPos = position;
  vUv = uv;
  vInstanceID = idx;
  vXY = vec2(x, y);
  vD = map.b;


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}