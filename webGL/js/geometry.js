    
    function loadGeometry(url,callback, errorCallback) {
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //handleLoadedGeometry(JSON.parse(request.responseText));
                if (request.status == 200)
                callback(request.responseText);
            }
            else { // Failed
                errorCallback(url);
            }
        }
        request.send();
    }

    
    // -----------------------------------------------------------------------   



    function handleLoadedGeometry(geometryData, gl, vertexPositionBuffer, vertexIndexBuffer, vertexNormalBuffer, vertexTextureCoordBuffer,
    vertexBinormalBuffer, vertexTangentBuffer ) {


//alert(geometryData.vertexPositions);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryData.vertexPositions), gl.STATIC_DRAW);
        vertexPositionBuffer.itemSize = 3;
        vertexPositionBuffer.numItems = geometryData.vertexPositions.length / 3;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometryData.indices), gl.STATIC_DRAW);
        vertexIndexBuffer.itemSize = 1;
        vertexIndexBuffer.numItems = geometryData.indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryData.vertexNormals), gl.STATIC_DRAW);
        vertexNormalBuffer.itemSize = 3;
        vertexNormalBuffer.numItems = geometryData.vertexNormals.length / 3;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometryData.vertexTextureCoords), gl.STATIC_DRAW);
        vertexTextureCoordBuffer.itemSize = 2;
        vertexTextureCoordBuffer.numItems = geometryData.vertexTextureCoords.length / 2;

        computeAndUploadTangentSpace(geometryData.vertexPositions, geometryData.vertexNormals,gl, vertexBinormalBuffer, vertexTangentBuffer);

    }


    // ===========================================================================
    // ===========================================================================
    // ===========================================================================

function computeAndUploadTangentSpace(vertices, normals,gl,vertexBinormalBuffer,vertexTangentBuffer)
{
    if(vertices.length!=normals.length || vertices.length<=0 || normals.length<=0){
        console.log("input data is degenerate. // vertices:" + vertices.length + ", normals: " + normals.length);
        return;
    }
    
    var binormals = new Array(vertices.length);
    var tangents = new Array(vertices.length);

    var w = [0,0,0];
    var u = [0,0,0];
    var v = [0,0,0];
    var b = [0,0,0];

    for(var i=0; i<vertices.length; i+=3){
        //w.setElements([normals[i+0], normals[i+1], normals[i+2]]);
        w[0] = normals[i+0];
        w[1] = normals[i+1];
        w[2] = normals[i+2];

        vec3.normalize(w);

        b[0] = 0.0;
        b[1] = 30.0;
        b[2] = 1.0;

        vec3.normalize(b);

        vec3.cross(w,b,u);

        //u = w.cross(b);
        vec3.normalize(u);

        //v = u.cross(w);
        vec3.cross(u,w,v);
        vec3.normalize(v);

        tangents[i+0] = u[0];//u.e(1);
        tangents[i+1] = u[1];//u.e(2);
        tangents[i+2] = u[2];//u.e(3);
        binormals[i+0] = v[0];//v.e(1);
        binormals[i+1] = v[1];//v.e(2);
        binormals[i+2] = v[2];//v.e(3);
    }

    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBinormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormals), gl.STATIC_DRAW);
    vertexBinormalBuffer.itemSize = 3;
    vertexBinormalBuffer.numItems = binormals.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
    vertexTangentBuffer.itemSize = 3;
    vertexTangentBuffer.numItems = tangents.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}



    // -----------------------------------------------------------------------

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
