import { update } from "./src/render.js"

// APP
let { time, delta } = { time: 0, delta: 0 };

const renderData = {
  time: 0,
  delta: 0,
}

function loop() {
  time = delta / 1000;
  delta = 1 / (performance.now() - delta);

  update(renderData);

  renderData.time = time;
  renderData.delta = delta;

  window.requestAnimationFrame(loop);
  delta = performance.now();
}
window.requestAnimationFrame(loop);