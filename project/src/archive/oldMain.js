main();
let squareRotation = 0.0;
let deltaTime = 0;

// Mozilla's tutorial on WebGL was used as a base for this example.
// See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// The original source is here: https://github.com/mdn/webgl-examples

/************************************
 * MAIN
 ************************************/

function main() {
    var vsSource= `#version 300 es
        // VERTEX SHADER CODE
        in vec4 aVertexPosition;
        in vec4 aColor;
        in vec3 aVertexNormal;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        out vec4 vColor;
        out vec3 vLighting;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aColor;

            // Apply lighting effects:
            highp vec3 ambientLight = vec3(0.2,0.2,0.2);
            highp vec3 directionalLightColor = vec3(1,1,1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = 
                max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }`;

    var fsSource = `#version 300 es
        // FRAG SHADER CODE
        precision highp float;
        in vec4 vColor;
        in vec3 vLighting;
        out vec4 outColor;
        void main() {
            outColor = vec4(vColor.rgb * vLighting, vColor.a);
        }
    `;

    //=========== SETUP CANVAS =================
    console.log("setup canvas");
    const canvas = document.querySelector("#driveGLCanvas");
    var gl = canvas.getContext("webgl2", { antialias: true });
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);  

    // collect info about program
    //=========== SETUP PROGRAM =================
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        },
    };

    // =========== INIT BUFFERS ===================
    const buffers = initBuffers(gl);


    //========= CAPTURE MOUSE EVENTS =============

    let objects = [
        {
            model: new Mover(vec3.fromValues(0.0,0.0,-10.0), mass = 10),
            buffers: null,
        },
        {
            model: new Mover(vec3.fromValues(1.0,2.0,-15.0), mass = 5),
            buffers: null,
        },
        {
            model: new Mover(vec3.fromValues(3.0,2.0,-15.0), mass = 15),
            buffers: null,
        },
        {
            model: new Mover(vec3.fromValues(3.0,2.0,-15.0), mass = 15),
            buffers: null,
        },
    ]
    var drag = false;
    var x_prev, y_prev;
    var dX = 0, dY = 0;
    var mouseDown = function(e) {
        drag = true;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
        return false;
    };
    var mouseUp = function(e){
        drag = false;
    };
    var mouseMove = function(e) {
        if (!drag) return false;
        dX = (e.pageX - x_prev) * 2 * Math.PI / canvas.width * 0.01;
        dY = (e.pageY - y_prev) * 2 * Math.PI / canvas.height * 0.01;
        objects.forEach(object => {
            object.model.applyRotationalForce(vec3.fromValues(dX,dY,0), vec3.fromValues(1,1,0));
        });
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
    };

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    // Event listener for arrow key presses
    const vel = 0.05;
    objects[0].model.applyForce([0,-0.3,0.3])
    objects[0].model.applyRotationalForce([0.0005,0.0005,0.0005], [0,1,1]);
    objects[1].model.applyForce([0,0.1,0.1])
    objects[2].model.applyForce([1,-0.3,-0.2])
    var force = [0,0,0]
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                force = [0,vel,0];
                break;
            case "ArrowDown":
                force = [0,-vel,0];
                break;
            case "ArrowLeft":
                force = [-vel,0,0];
                break;
            case "ArrowRight":
                force = [vel,0,0];
                break;
        }
        objects.forEach(object => {
            object.model.applyForce(force); 
        });
    })

 
    //========= GAME LOOP =============
    let then = 0;
    let gravity = vec3.fromValues(0.0,-0.1,0.0);
    // box.applyForce(gravity);
    function render(now) {
        // continue rotation after releasing click
        objects.forEach(object => {
            object.model.applyForce(gravity)
            object.model.update();
            if (!drag) {
                dX *= object.model.rotation.amortization;
                dY *= object.model.rotation.amortization;
                object.model.rotation.theta += dX;
                object.model.rotation.phi += dY;
            }
        });
        now *= 0.001; // convert to seconds
        deltaTime = now-then;
        then = now;
        drawScene(gl, programInfo, buffers, objects);
        squareRotation += deltaTime; // Not currently drawin indipendent of framrate

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

