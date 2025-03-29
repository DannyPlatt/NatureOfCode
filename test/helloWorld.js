// pass in a attribute regarding position
const vertexShaderSource = `#version 300 es

layout(location=0) in vec4 aPosition;
layout(location=1) in vec3 aOffset;
layout(location=2) in float scale;
layout(location=3) in vec4 aColor;

out vec4 vColor;

void main()
{
  vColor = aColor;
  gl_Position = vec4(aPosition.xyz * scale + aOffset, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 fragColor;
void main()
{
  fragColor = vColor;
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const program = gl.createProgram();

// CREATE SHOW PROGRAM
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
  console.log("VertexShaderError: ",gl.getShaderInfoLog(vertexShader));
  console.log("FragmentShaderError: ",gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const modelData = new Float32Array([
  //Position
    -1,-.7,
    0,.8,
    1,-.7,
])

const modelBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

const transformData = new Float32Array([
  //offset      scale   color
    -.2, .7,    .1,     1,0,0,
    .2, .1,     .2,     1,0,1,
])

// init transfromData
const positionData = new Array();
const colorData = new Array();
const objCount = 26000

for (let i = 0; i <= objCount; i++){
  let position = [(Math.random()-0.5) * 2, (Math.random()-.5)*2 , Math.random()-.5];
  let color = [Math.random(), Math.random(), Math.random()];
  let scale = 0.01;
  colorData.push(position);
  colorData.push(scale);
  colorData.push(color);
}
console.log(colorData.flat());

function render() {

  for (let i = 0; i <= objCount; i++){
    colorData[i*3][0] +=  (Math.random()) * 0.01;
    colorData[i*3][1] +=  (Math.random()) * 0.01;
    colorData[i*3][1] +=  (Math.random()) * 0.01;
    if (colorData[i*3][0] < -1){
      colorData[i*3][0] = 1
    }
    if (colorData[i*3][0] > 1){
      colorData[i*3][0] = -1
    }
    if (colorData[i*3][1] < -1){
      colorData[i*3][1] = 1
    }
    if (colorData[i*3][1] > 1){
      colorData[i*3][1] = -1
    }
    if (colorData[i*3][2] < -1){
      colorData[i*3][2] = 1
    }
    if (colorData[i*3][2] > 1){
      colorData[i*3][2] = -1
    }
  }

  
  // const transformBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData.flat()), gl.STATIC_DRAW);
  // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData.flat()), gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 28, 0);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 28, 12);
  gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 28, 16);

  // location, divisor(times to reuse transform values)
  gl.vertexAttribDivisor(1, 1)
  gl.vertexAttribDivisor(2, 1)
  gl.vertexAttribDivisor(3, 1)

  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);
  gl.enableVertexAttribArray(3);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, objCount);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

