out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * vec4(position, 1.0);
}