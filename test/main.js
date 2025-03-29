// calculation program shaders
const calcVertexShaderSource = `#version 300 es

layout(location=0) in float input1;
layout(location=1) in float input2;


out float output1;
out float output2;

void main()
{
  output1 = input1 + 0.01;
  output2 = input2 + 1.0;
}`;

const calcFragmentShaderSource = `#version 300 es
void main()
{
}`;


// pass in a attribute regarding position
const showVertexShaderSource = `#version 300 es
layout(location=0) in vec2 aPosition;
uniform float uPointSize;
void main()
{
  gl_Position = vec4(aPosition, 0.0, 1.0);
  gl_PointSize = uPointSize;
}`;

const showFragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main()
{
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const showProgram = gl.createProgram();
const calcProgram = gl.createProgram();

// CREATE SHOW PROGRAM
const showVertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(showVertexShader, showVertexShaderSource);
gl.compileShader(showVertexShader);
gl.attachShader(showProgram, showVertexShader);

const showFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(showFragmentShader, showFragmentShaderSource);
gl.compileShader(showFragmentShader);
gl.attachShader(showProgram, showFragmentShader);

gl.linkProgram(showProgram);


if(!gl.getProgramParameter(showProgram, gl.LINK_STATUS)){
  console.log(gl.getShaderInfoLog(showVertexShader));
  console.log(gl.getShaderInfoLog(showFragmentShader));
}

// CREATE CALC PROGRAM
const calcVertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(calcVertexShader, calcVertexShaderSource);
gl.compileShader(calcVertexShader);
gl.attachShader(calcProgram, calcVertexShader);

const calcFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(calcFragmentShader, calcFragmentShaderSource);
gl.compileShader(calcFragmentShader);
gl.attachShader(calcProgram, calcFragmentShader);

gl.transformFeedbackVaryings(calcProgram, ['output1', 'output2'], gl.INTERLEAVED_ATTRIBS);

gl.linkProgram(calcProgram);


if(!gl.getProgramParameter(calcProgram, gl.LINK_STATUS)){
  console.log(gl.getShaderInfoLog(vertexShader));
  console.log(gl.getShaderInfoLog(calcFragmentShader));
}



// // PERFORM CALCULATIONS
gl.useProgram(calcProgram);

const COUNT = 1000;
const view = new Float32Array(2*COUNT);

const initialData = new Float32Array(COUNT*2).map((v, i) => 0);
console.log(initialData)

const buffer1 = gl.createBuffer();
const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, 2*COUNT*4, gl.DYNAMIC_READ);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, initialData);
gl.vertexAttribPointer(0,1,gl.FLOAT, false, 8, 0);
gl.vertexAttribPointer(1,1,gl.FLOAT, false, 8, 4);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);


const buffer2 = gl.createBuffer();
const vao2 = gl.createVertexArray();
gl.bindVertexArray(vao2);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, 2*COUNT*4, gl.DYNAMIC_READ);
gl.vertexAttribPointer(0,1,gl.FLOAT, false, 8, 0);
gl.vertexAttribPointer(1,1,gl.FLOAT, false, 8, 4);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

gl.bindVertexArray(null)
gl.bindBuffer(gl.ARRAY_BUFFER, null);




// create render loop for objects


// DRAW PROGRAM:
gl.useProgram(showProgram);

// Uniforms 
const uPointSizeLoc = gl.getUniformLocation(showProgram, 'uPointSize');

// attributes
// test position values
const positionData = new Float32Array([
  0,0,
  .5,.5,
  -0.8, -0.2,
])
const aVertexPosLoc = gl.getAttribLocation(showProgram, 'aPosition');
if (aVertexPosLoc === -1){
    printError('Shader Location Error', 'One or more of the uniform and attribute variables in the shaders could not be located');
}

gl.enableVertexAttribArray(aVertexPosLoc);

const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, view, gl.STATIC_DRAW);
gl.vertexAttribPointer(aVertexPosLoc, 2, gl.FLOAT, false, 2 * 4, 0);




gl.uniform1f(uPointSizeLoc,5);

let vao = vao1;
let buffer = buffer2;

for (let i = 0; i < 100; i++) {
  gl.useProgram(calcProgram);
  gl.enable(gl.RASTERIZER_DISCARD)
  gl.bindVertexArray(vao);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, 1000);
  gl.endTransformFeedback();

  if (vao === vao1) {
    vao = vao2;
    buffer = buffer1;
  }else {
    vao = vao1;
    buffer = buffer2;
   }
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, view);
  gl.disable(gl.RASTERIZER_DISCARD)
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

  // draw
  gl.useProgram(showProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, view, gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, view.length/2);
}

console.log(view);






