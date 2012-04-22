define(
["framework/graphic/WebGL"],
function(WebGL){
    return {
        create: function() {

            var _self = {

                init: function(posBuf, norBuf, texBuf, indBuf, texture) {

                    //Assign buffers
                    _posBuf = posBuf;
                    _texBuf = texBuf;
                    _indBuf = indBuf;
                    _norBuf = norBuf;
                    _texture= texture;

                    return _self;
                },

                destroy: function() {
                    throw "not implemented yet!";
                },

                setPolyOffset: function(active, val_0, val_1) {
                    _isPolyOffsetActive = active;
                    if(val_0) _polygonOffset[0] = val_0;
                    if(val_1) _polygonOffset[1] = val_1;
                },

                setTexture: function(texture) { _texture = texture; },

                setModelTransform: function(modelTrans) { _modelTransform = modelTrans; },

                setColorAmbient: function(color) { _color.ambient = color; },
                setColorDiffuse: function(color) { _color.diffuse = color; },
                setColorSpecular: function(color) { _color.specular = color; },
                setSpecPow: function(pow) { _color.specPow = pow; },

                /**
                 * Call this to draw to the screen
                 */
                render: function(shader) {
                    //Assign the buffers
                    WebGL.pointAttrib(shader.getAttribute("aPos"), _posBuf.getBuffer());
                    WebGL.pointAttrib(shader.getAttribute("aTex"), _texBuf.getBuffer());
                    WebGL.pointAttrib(shader.getAttribute("aNor"), _norBuf.getBuffer());

                    //Model transform
                    WebGL.gl.uniformMatrix4fv(shader.getUniform("uMMat"), false, _modelTransform);
                    
                    //Get gl
                    var gl = WebGL.gl;

                    //Activate texture
                    if(_texture && _texture.isLoaded()) {
                        _texture.uploadToGL();
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, _texture.getGLTex());
                        gl.uniform1i(shader.getUniform("sampler_0"), 0);
                        gl.uniform1i(shader.getUniform("useTexture"), 1);
                    } else {
                        gl.uniform4fv(shader.getUniform("uMAmbient"), _color.ambient);
                        gl.uniform4fv(shader.getUniform("uMDiffuse"), _color.diffuse);
                        gl.uniform4fv(shader.getUniform("uMSpecular"), _color.specular);
                        gl.uniform1f(shader.getUniform("uMSpecPow"), _color.specPow);
                        gl.uniform1i(shader.getUniform("useTexture"), 0);
                    }

                    //Polygon offset
                    if(_isPolyOffsetActive) {
                        gl.enable(gl.POLYGON_OFFSET_FILL);
                        gl.polygonOffset(_polygonOffset[0], _polygonOffset[1]);
                    }

                    //Draw call
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indBuf.getBuffer());
                    gl.drawElements(gl.TRIANGLES, _indBuf.getNumItems(), gl.UNSIGNED_SHORT, 0);
                    
                    //Polygon offset
                    if(_isPolyOffsetActive) {
                        gl.disable(gl.POLYGON_OFFSET_FILL);
                    }
                }
            };

            //Privates
            var _polygonOffset = [0,0];
            var _isPolyOffsetActive;
            var _texture;
            var _modelTransform;
            var _posBuf;
            var _texBuf;
            var _indBuf;
            var _norBuf;
            var _color = {
                ambient: [0.5, 0.5, 0.5, 1.0],
                diffuse: [Math.random(), Math.random(), Math.random(), 1.0],
                specular: [Math.random(), Math.random(), Math.random(), 1.0],
                specPow: 50,
            };

            return _self;
        }
    }
});