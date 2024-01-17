import * as THREE from 'three';


//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RenderTargetCreator } from './RenderTargetCreator.js';


const { PI, sin, cos, abs } = Math
//const devGUI = new DevGUI();

//? INIT CANVAS
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas
});
const gl = renderer.getContext();

console.info(
  "ThreeJS",
  THREE.REVISION,
  gl.getParameter(gl.VERSION)
);
console.info('APP VERSION - 15.12.2023');



let isMobile = false;
let isAssetsLoad = false;
let loadStatus = 0;
let frame = 0;



const PATH = {
  fonts: "assets/fonts/",
  models: "assets/models/",
  textures: "assets/textures/",
  shaders: "assets/shaders/",
}


const models = {}
const scenes = {}
const meshes = {}
const lights = {}
const textures = {}
const videos = {}
const materials = {}
const cameras = {}
const depthCameras = {}
const renderTargets = {}


const bufferSize = { x: 200, y: 200 }


//! UNIFORMS
const uniforms = {
  // common uniforms
  uTime: { value: 0.0 },
  uAspect: { value: 0.0 },
  uFrame: { value: 0.0 },
  uResolution: { value: { x: canvas.clientWidth, y: canvas.clientHeight } },
  uMouse: { value: { x: 0, y: 0, z: 0, w: 0 } },
  uMouseTime: { value: 0 },
  uViewPos: { value: new THREE.Vector3() },
  uDPR: { value: 0 },
  uIsMobile: { value: false },

  uBufferSize: { value: bufferSize },
  uMovePoint: { value: { x: 0, y: 0, z: 0, w: 0 } },
  uLinesCount: { value: 0 },
  uLinesCountS: { value: 0 },
  uMousePosPlane: { value: { x: 0, y: 0 } },

  bufferA: { value: false }
};

//! FBOs
const FBOs = [
  {
    name: "bufferA", size: bufferSize,
    isSave: true,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  }
];


//! SCENES & LIGHT & COLOR
scenes.main = new THREE.Scene();
/*
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;*/
renderer.setClearColor(0x000000);
//renderer.setClearAlpha(0);




//! CAMERS & CONTROLLERS
cameras.main = new THREE.PerspectiveCamera(75, 2, 0.01, 100);
cameras.main.position.set(0, 0, 1);

cameras.draw = new THREE.OrthographicCamera(
  -0.5, 0.5, 0.5, -0.5, 0, 1
);
/*
const controlsO = new OrbitControls(cameras.main, renderer.domElement);
controlsO.enablePan = true;
controlsO.minDistance = 1;
controlsO.maxDistance = 1000;
controlsO.target.set(50, 10, 0);
*/




//! LOADERS
const loadManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadManager);
const fileLoader = new THREE.FileLoader(loadManager);
//const gltfLoader = new GLTFLoader(loadManager);




const loaderDOM = document.querySelector('#loading');
loaderDOM.style.display = 'none';
let assetsName = '';

loadManager.onProgress = (url, loaded, total) => {
  loadStatus = Math.round(100 * ((loaded - 1) / total));
  console.log(
    `%c${url}`, 'color: #00FF00',
    `${loadStatus}%`
  );
  assetsName = url.split('/')[1].toUpperCase();
};

loadManager.onLoad = () => {
  console.log(`%cASSETS: ${assetsName} LOADED`, 'color: yellow');
  loaderDOM.style.display = 'none';
  isAssetsLoad = true;
};

loadManager.onError = (url) => {
  console.error("Load error:", url.split("undefined").join(''));
};





//! LOAD FILES
async function loadFiles() {

}

//! LOAD TEXTURES
async function loadTextures() {
  /*{
    const texture = await textureLoader.loadAsync(PATH.textures + 'mask_0.png');

    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    uniforms.tMask0.value = texture;
  }
  {
    const texture = await textureLoader.loadAsync(PATH.textures + 'mask_1.jpg');

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    uniforms.tMask1.value = texture;
  }

  {
    videos.main = document.createElement('video');
    videos.main.crossOrigin = 'anonymous';
    videos.main.src = PATH.textures + 'output.webm';
    videos.main.load();
    videos.main.playbackRate = 2.0;
    videos.main.currentTime = 20;
    videos.main.loop = true;
    videos.main.muted = true;

    //if(videos.oct.load()) 
    {
      console.log(videos.main.src);

      const videoTexture = new THREE.VideoTexture(videos.main);
      videoTexture.magFilter = THREE.NearestFilter;
      videoTexture.minFilter = THREE.NearestFilter;
      videoTexture.wrapS = THREE.ClampToEdgeWrapping;
      videoTexture.wrapT = THREE.ClampToEdgeWrapping;
      textures.videoMain = videoTexture;
      uniforms.tVideo.value = videoTexture;
    }
  }*/
}


//! LOAD SHADERS
async function loadShaders() {
  const chunks = [
    { name: "commonMain", glsl: "commonMain.glsl" },
    { name: "chank", glsl: "1.glsl" },
  ];

  const shaders = [
    { name: "bufferA", vert: "default2D.vert", frag: "bufferA.frag" },
    { name: "image", vert: "default3D.vert", frag: "image.frag" },
    { name: "lines", vert: "lines.vert", frag: "lines.frag" },
  ];

  for (const { name, glsl } of chunks) {
    THREE.ShaderChunk[name] = await fileLoader.loadAsync(
      PATH.shaders + 'chunks/' + glsl
    );
  }

  for (const { name, vert, frag } of shaders) {
    const pathVert = PATH.shaders + 'vert/' + vert;
    const pathFrag = PATH.shaders + 'frag/' + frag;

    materials[name] = new THREE.ShaderMaterial({
      uniforms: uniforms
    });

    if (vert) {
      const vertSrc = await fileLoader.loadAsync(pathVert);
      materials[name].vertexShader = vertSrc;
    }

    if (frag) {
      const fragSrc = await fileLoader.loadAsync(pathFrag);
      materials[name].fragmentShader = fragSrc;
    }
  }
}

//! LOAD MODELS
async function loadModels() {
  {
    //const gltf = await gltfLoader.loadAsync(PATH.models + 'gltf/truck_with_shadowMesh.glb');
    //const model = gltf.scene.children[0];
    /*
      model.traverse((object) => {
        const name = object.name;
        console.log(name);
      });
    */
    //models.test = model;
  }
}

//! LOAD FONTS
async function loadFonts() {

}



//! CREATE FBOs
const fbo = new RenderTargetCreator(THREE);

function createFBOs(width, height) {
  for (const { name, size, isSave, format, type, minFilter, magFilter, internalFormat } of FBOs) {
    renderTargets[name] = fbo.create(
      size.x, size.y, {
      isSave,
      minFilter,
      magFilter,
      format,
      type,
      internalFormat
    });
  }
}

//! START 
function start() {
  //? FBOs PLANE
  {
    for (const { name } of FBOs) {
      scenes[name] = new THREE.Scene();
      meshes[name] = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.0),
        materials[name]
      );
      scenes[name].add(meshes[name]);
    }
  }

  //? RAY PLANE
  {
    meshes['plane'] = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 1.0),
      //new THREE.MeshBasicMaterial()
      materials['image']
    );
    meshes['plane'].visible = false;
    scenes.main.add(meshes.plane);
    meshes.plane.position.z = 0.7;
  }



  //? LINES
  {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 1]), 3)
    );

    let g = new THREE.InstancedBufferGeometry().copy(lineGeometry);
    g.instanceCount = 20 * 20;
    meshes.lines = new THREE.Line(g, materials.lines);
    scenes.main.add(meshes.lines);
    meshes.lines.position.z = 0.7;

    uniforms.uLinesCount.value = g.instanceCount;
    uniforms.uLinesCountS.value = Math.ceil(Math.sqrt(g.instanceCount));
  }



  //videos.main.play();

  console.log('-'.repeat(30));
  onResize('start', renderer);
}


//await loadFiles();
await loadTextures();
await loadShaders();
await loadModels();
start();


window.onresize = () => onResize('onresize', renderer);
window.onload = () => onResize('onload', renderer);



//! MOUSE EVENTS
const mouse = new THREE.Vector2(0.01, 0);
const mousePos = new THREE.Vector2();
const mousePosPlane = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let mouseMoveTime = 0;

/*
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);

canvas.addEventListener('touchmove', onTouchMove);
*/

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('touchmove', onTouchMove);

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

  mousePos.x = event.clientX;
  mousePos.y = event.clientY;

  uniforms.uMouse.value.x = mousePos.x;
  uniforms.uMouse.value.y = canvas.clientHeight - mousePos.y;

  //console.log(mouse, uniforms.uMouse.value);

  uniforms.uMouse.value.w = 1;
  uniforms.uMouseTime.value += 1;


  raycaster.setFromCamera(mouse, cameras.main);

  if (meshes.plane) {
    const intersects = raycaster.intersectObject(meshes.plane);
    if (intersects.length > 0) {
      const point = intersects[0].point;

      mousePosPlane.x = point.x+0.5;
      mousePosPlane.y = point.y+0.5;

      uniforms.uMousePosPlane.value.x = point.x;
      uniforms.uMousePosPlane.value.y = point.y;
    }
  }
}

function onMouseDown(event) {
  const button = event.button;
  uniforms.uMouse.value.z = 1;
}

function onMouseUp(event) {
  const button = event.button;
  uniforms.uMouse.value.z = 0;
  //controlsC.enableRotate = true;
}

function onTouchMove(event) {
  event.preventDefault();

  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  mouse.x = (touchX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(touchY / canvas.clientHeight) * 2 + 1;

  mousePos.x = touchX;
  mousePos.y = touchY;
}


const moveVec = new THREE.Vector2();


function update(renderData) {

  if (isAssetsLoad) {
    if (frame <= 1.0) {
      onResize('render frame 0', renderer);
    }

    const { time, delta } = renderData;


    //# UNIFORMS
    uniforms.uFrame.value = frame;
    uniforms.uTime.value = time;
    uniforms.uViewPos.value = cameras.main.position;

    //! FBOs
    for (const { name } of FBOs) {
      const renderTarget = renderTargets[name];
      const { renderNum, textureNum } = fbo.getTargetNum(renderTarget, frame);

      uniforms[name].value = renderTarget[renderNum].texture;

      renderer.setViewport(0, 0, renderTarget.width, renderTarget.height);
      renderer.setRenderTarget(renderTarget[textureNum]);
      renderer.render(scenes[name], cameras.draw);
      renderer.setRenderTarget(null);
    }

    //renderer.autoClearColor = 0;

    renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    renderer.render(scenes.main, cameras.main);



    //? -----------------------------------

    //# MOVE POINTS
    moveVec.lerp(mousePosPlane, 0.1);
    uniforms.uMovePoint.value.x = moveVec.x;
    uniforms.uMovePoint.value.y = moveVec.y;

    if (uniforms.uMouse.value.w <= 0) {
      uniforms.uMouseTime.value = 0;
    }
    uniforms.uMouse.value.w = 0;

    //console.log('f', frame);
    frame++;
  }
}



function onResize(event, renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = clamp(window.devicePixelRatio, 1, 1);
  renderer.setPixelRatio(1.0);
  const width = (canvas.clientWidth);
  const height = (canvas.clientHeight);
  renderer.setSize(width, height, false);
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  /*bufferSize.x = width / 4;
  bufferSize.y = height / 4;
  uniforms.uBufferSize.value = bufferSize;*/

  const camera = cameras.main;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();


  uniforms.uDPR.value = window.devicePixelRatio;
  uniforms.uIsMobile.value = isMobile;
  uniforms.uResolution.value.x = canvas.clientWidth;
  uniforms.uResolution.value.y = canvas.clientHeight;
  uniforms.uAspect.value = camera.aspect;

  createFBOs(width, height);

  console.log('pixel ratio: [curent, device]', pixelRatio, window.devicePixelRatio);
  console.log(event + ' / resize', canvas.clientWidth, canvas.clientHeight);
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function logJSON(object) {
  console.log(JSON.stringify(object, null, 2));
}



export { update }


//* ПЕРЕПИСАТЬ ИНИТ ТЕКСТУР НА ЦИКЛ
//* ПОДЕЛИТЬ ЮНИФОРМЫ НА ОБЪЕКТЫ
//* ПОНЯТЬ НУЖНА ЛИ FBO 1 СЦЕНА И 1 МЕШ