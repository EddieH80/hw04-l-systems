import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Mesh from './geometry/Mesh';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import LSystem from './LSystem';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let cylinder: Mesh;
let screenQuad: ScreenQuad;
let lsystem: LSystem;
let time: number = 0.0;

function readTextFile(file: string) {
  var rawFile = new XMLHttpRequest();
  let out: string;
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.status === 200 || rawFile.status == 0) {
      out = rawFile.responseText;
    }
  }
  rawFile.send(null);
  return out;
}

function loadLSystem() {
  let cylinderObj = readTextFile("./cylinder.obj");
  cylinder = new Mesh(cylinderObj, vec3.fromValues(0, 0, 0));
  cylinder.create();

  lsystem = new LSystem("FX", 3);
  lsystem.iterate();

  // The columns of the transformation matrices
  let col1 = [];
  let col2 = [];
  let col3 = [];
  let col4 = [];

  let colors = [];

  let branchTransformations = lsystem.drawer.branchTransformations;
  let leafTransformations = lsystem.drawer.leafTransformations;
  
  // Push branch transformation matrices
  for (let i = 0; i < branchTransformations.length; i++) {
    let transformation = branchTransformations[i];

    col1.push(transformation[0]);
    col1.push(transformation[1]);
    col1.push(transformation[2]);
    col1.push(transformation[3]);

    col2.push(transformation[4]);
    col2.push(transformation[5]);
    col2.push(transformation[6]);
    col2.push(transformation[7]);

    col3.push(transformation[8]);
    col3.push(transformation[9]);
    col3.push(transformation[10]);
    col3.push(transformation[11]);

    col4.push(transformation[12]);
    col4.push(transformation[13]);
    col4.push(transformation[14]);
    col4.push(transformation[15]);

    colors.push(1.0);
    colors.push(1.0);
    colors.push(1.0);
    colors.push(1.0);
  }

  let colorsVBO = new Float32Array(colors);
  let col1VBO = new Float32Array(col1);
  let col2VBO = new Float32Array(col2);
  let col3VBO = new Float32Array(col3);
  let col4VBO = new Float32Array(col4);
  cylinder.setInstanceVBOs(col1VBO, col2VBO, col3VBO, col4VBO, colorsVBO);
  cylinder.setNumInstances(branchTransformations.length);

  // Empty out arrays
  col1 = [];
  col2 = [];
  col3 = [];
  col4 = [];
  colors = [];

  // Push leaf transformation matrices
  for (let i = 0; i < leafTransformations.length; i++) {
    let transformation = leafTransformations[i];

    col1.push(transformation[0]);
    col1.push(transformation[1]);
    col1.push(transformation[2]);
    col1.push(transformation[3]);

    col2.push(transformation[4]);
    col2.push(transformation[5]);
    col2.push(transformation[6]);
    col2.push(transformation[7]);

    col3.push(transformation[8]);
    col3.push(transformation[9]);
    col3.push(transformation[10]);
    col3.push(transformation[11]);

    col4.push(transformation[12]);
    col4.push(transformation[13]);
    col4.push(transformation[14]);
    col4.push(transformation[15]);

    colors.push(1.0);
    colors.push(1.0);
    colors.push(1.0);
    colors.push(1.0);
  }
  colorsVBO = new Float32Array(colors);
  col1VBO = new Float32Array(col1);
  col2VBO = new Float32Array(col2);
  col3VBO = new Float32Array(col3);
  col4VBO = new Float32Array(col4);
  cylinder.setInstanceVBOs(col1VBO, col2VBO, col3VBO, col4VBO, colorsVBO);
  cylinder.setNumInstances(leafTransformations.length);
}

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let offsetsArray = [];
  let colorsArray = [];
  let n: number = 100.0;
  for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
      offsetsArray.push(i);
      offsetsArray.push(j);
      offsetsArray.push(0);

      colorsArray.push(i / n);
      colorsArray.push(j / n);
      colorsArray.push(1.0);
      colorsArray.push(1.0); // Alpha channel
    }
  }
  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  square.setInstanceVBOs(offsets, colors);
  square.setNumInstances(n * n); // grid of "particles"
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();
  loadLSystem();

  const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      cylinder
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
