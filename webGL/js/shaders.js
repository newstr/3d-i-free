// -----------------------------------------------------------------------
	function loadShader(gl, id) {
    var shadeCode = document.getElementById(id);
    if (!shadeCode) {
        return null;
    }

    var str = "";
    var k = shadeCode.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shadeCode.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shadeCode.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
// -----------------------------------------------------------------------
function initShaders(gl) {
    var fragmentShader = loadShader(gl, "shader-fs");
    var vertexShader = loadShader(gl, "shader-vs");

    var shaderProgram;
	shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders - " + gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);


        shaderProgram.vertexBinormalAttribute = gl.getAttribLocation(shaderProgram, "aBinormal");
        gl.enableVertexAttribArray(shaderProgram.vertexBinormalAttribute);

        shaderProgram.vertexTangentAttribute = gl.getAttribLocation(shaderProgram, "aTangent");
        gl.enableVertexAttribArray(shaderProgram.vertexTangentAttribute);




        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.NormalMapSamplerUniform = gl.getUniformLocation(shaderProgram, "uSamplernormalMap");
	
	return shaderProgram;
}
// -----------------------------------------------------------------------