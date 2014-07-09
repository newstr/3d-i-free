
    var GL;
	var ShaderProgram;
	var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
	var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;

	// ----------------------------------------------------------------------------------------------------------------
    // init GL
    // normalMuping, phong, blind (TBN)
    // aclusion paralax
    // mouse




	function initGL(canvas) {
        try {
             var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL");
        }
        return gl;
    }
	// ----------------------------------------------------------------------------------------------------------------

   function setMatrixUniforms(gl,shaderProgram,pMatrix,mvMatrix) {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        var normalMatrix = mat3.create();
        //mat3.transpose(normalMatrix);
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }


	// ----------------------------------------------------------------------------------------------------------------


 var Angle = 0;
var Angle2 = 0;
var rotationSpeed = 0.8;


    function drawScene(gl,shaderProgram, vertexPositionBuffer, vertexIndexBuffer, vertexNormalBuffer, vertexTextureCoordBuffer, vertexBinormalBuffer, vertexTangentBuffer, pMatrix, mvMatrix, texture, texture2) {
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (vertexPositionBuffer == null || vertexNormalBuffer == null || vertexTextureCoordBuffer == null || vertexIndexBuffer == null) {
            alert("null");
            return;
        }

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0, 0, -40]);
        mat4.rotate(mvMatrix, degToRad(Angle2), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(Angle), [0, 1, 0]);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
  
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.uniform1i(shaderProgram.NormalMapSamplerUniform, 1);


            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            //gl.enable(gl.BLEND);
            //gl.disable(gl.DEPTH_TEST);
            //gl.uniform1f(shaderProgram.alphaUniform, 1.0);
        

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBinormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexBinormalAttribute, vertexBinormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTangentBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexTangentAttribute, vertexTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
        setMatrixUniforms(gl,shaderProgram,pMatrix,mvMatrix);
        gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    // ----------------------------------------------------------------------------------------------------------------


    var teapotPath = "/webGL/geometry/teapot.json";
    var cube1Path = "/webGL/geometry/cube.json";
    var cubePath = "/webGL/geometry/cube2.json";

    var ifreeTexture = "/webGL/textures/ifree.jpg";
    var synqeraTexture = "/webGL/textures/synqera.jpg";
    var teapotTexture = "/webGL/textures/qinghua.jpg";

    var teapotTextureNormalmap = "/webGL/textures/qinghua_normalmap.jpg";

    var geometryPath = teapotPath;
    var TexturePath = teapotTexture;
    var TextureNormalmapPath = teapotTextureNormalmap;

    function webGLStart() {
            

        var canvas = document.getElementById("canvas");
        var GL = initGL(canvas);
        var ShaderProgram = initShaders(GL);

        var VertexPositionBuffer = GL.createBuffer();
        var VertexIndexBuffer = GL.createBuffer();
        var VertexNormalBuffer = GL.createBuffer();
        var VertexTextureCoordBuffer = GL.createBuffer();

        var VertexBinormalBuffer = GL.createBuffer();
        var VertexTangentBuffer = GL.createBuffer();

        var Texture = GL.createTexture(); 
        var TextureNormalMap = GL.createTexture();
        initTexture(GL,Texture,TexturePath,0);
        initTexture(GL,TextureNormalMap,TextureNormalmapPath,1);

        loadGeometry(geometryPath,function (responseText) 

            { var o = JSON.parse(responseText);
            
            handleLoadedGeometry(o, GL, VertexPositionBuffer, VertexIndexBuffer, VertexNormalBuffer, VertexTextureCoordBuffer, VertexBinormalBuffer, VertexTangentBuffer);




        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        GL.enable(GL.DEPTH_TEST);
            //GL.blendFunc(GL.SRC_ALPHA, GL.ONE);
            //GL.enable(GL.BLEND);
            //GL.disable(GL.DEPTH_TEST);

        var MVMatrix = mat4.create();
        var PMatrix = mat4.create();

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        var lastTime = 0;

        function animate() {
            var timeNow = new Date().getTime();
            if (lastTime != 0) {
                var elapsed = timeNow - lastTime;

                //Angle += 0.05 * elapsed;
            }
            lastTime = timeNow;
        }


        function tick() {
            requestAnimFrame(tick);
            handleKeys();
            drawScene(GL,ShaderProgram, VertexPositionBuffer, VertexIndexBuffer, VertexNormalBuffer, VertexTextureCoordBuffer,VertexBinormalBuffer, VertexTangentBuffer ,PMatrix,MVMatrix, Texture, TextureNormalMap);
            animate();
        };

        //drawScene(GL,ShaderProgram, VertexPositionBuffer, VertexIndexBuffer, VertexNormalBuffer, VertexTextureCoordBuffer,PMatrix,MVMatrix);
        //tick(GL,ShaderProgram, VertexPositionBuffer, VertexIndexBuffer, VertexNormalBuffer, VertexTextureCoordBuffer,PMatrix,MVMatrix);
        tick();


             }, function (url) {/* alert('Failed to download "' + url + '"');*/ });
    }

    var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
/*
        if (String.fromCharCode(event.keyCode) == "F") {
            filter += 1;
            if (filter == 3) {
                filter = 0;
            }
        }*/
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }


    function handleKeys() {
         if (currentlyPressedKeys[37]) {
            // Left cursor key
            Angle -= rotationSpeed;
        }
        if (currentlyPressedKeys[39]) {
            // Right cursor key
            Angle += rotationSpeed;
        }
        if (currentlyPressedKeys[38]) {
            // Up cursor key
            Angle2 -= rotationSpeed;
        }
        if (currentlyPressedKeys[40]) {
            // Down cursor key
            Angle2 += rotationSpeed;
        }


        if (currentlyPressedKeys[49]) { // 1
             //geometryPath = teapotPath;

        }
        if (currentlyPressedKeys[50]) {
            //geometryPath = cube1Path;
            // webGLStart();
 
        }
    }

        // ----------------------------------------------------------------------------------------------------------------
  

