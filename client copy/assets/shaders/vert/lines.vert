#include <commonMain>
#include <chank>

uniform vec2 uPlaneSize;
uniform float uLinesCount;
uniform float uLinesCountS;

out vec4 vColor;
out vec2 vUv;
out float vInstanceID;
out vec2 vXY;



void main() {
  float SIZE = 0.05;
  vec2 OFFSET = vec2(SIZE, SIZE);
  //vec2 OFFSET = vec2(SIZE+0.01);

  float idx = float(gl_InstanceID) * uLinesCountS;
  float x = mod(idx, uLinesCount);
  float y = floor(idx / uLinesCount);



  //! POSITION
  vec3 pos = vec3(position.x*SIZE, position.y*SIZE, 0.0);
  pos.xy += vec2(x*OFFSET.x*0.05, y*OFFSET.y)-SIZE*uLinesCountS*0.5+SIZE*0.5;





  //! UV & MAPS
  vec2 uv = vec2(pos.xy+0.5);
  vec4 map = texture(bufferA, uv);


  if (position.x != 0.0) 
  {  
    pos.xy += vec2(
      -0.06,//surface3(vec3(vec2(x, y)*10.0, 0.0)),
      surface3(vec3(vec2(y, x)*10.0, 0.0))*0.02-0.02
    );
  } 

  if (position.x != 0.0) 
  {  
    pos.xy += map.rg*0.01;
  } else {
  pos.xy += map.rg*0.001;
  }

  pos.x += SIZE; 



  vColor = map;

  vUv = uv;
  vInstanceID = idx;
  vXY = vec2(x, y);


  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}