define(
["framework/graphic/WebGL"],
function(WebGL){
    return {
        create: function() {

            var _self = {

                init: function(posBuf, indBuf) {

                    //Assign buffers
                    _posBuf = posBuf;
                    _indBuf = indBuf;

                    return _self;
                },

                destroy: function() {
                    throw "not implemented yet!";
                },

                /**
                 * Call this to draw to the screen
                 */
                render: function(shader) {
                    //Exit if not visible
                    if(!_visible) return;

                    //Assign the buffers
                    WebGL.pointAttrib(shader.getAttribute("aPos"), _posBuf.getBuffer());

                    //Model transform
                    WebGL.gl.uniformMatrix4fv(shader.getUniform("uMMat"), false, _modelTransform);
                    
                    //Get gl
                    var gl = WebGL.gl;
                    
                    //Set color    
                    gl.uniform4fv(shader.getUniform("uColor"), _color);

                    //Polygon offset
                    if(_isPolyOffsetActive) {
                        gl.enable(gl.POLYGON_OFFSET_FILL);
                        gl.polygonOffset(_polygonOffset[0], _polygonOffset[1]);
                    }

                    //Draw call
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indBuf.getBuffer());
                    gl.drawElements(gl.LINES, _indBuf.getNumItems(), gl.UNSIGNED_SHORT, 0);
                    
                    //Polygon offset
                    if(_isPolyOffsetActive) {
                        gl.disable(gl.POLYGON_OFFSET_FILL);
                    }
                },

                setPolyOffset: function(active, val_0, val_1) {
                    _isPolyOffsetActive = active;
                    if(val_0) _polygonOffset[0] = val_0;
                    if(val_1) _polygonOffset[1] = val_1;
                },
                setColor: function(color) { _color = color; },
                setModelTransform: function(modelTrans) { _modelTransform = modelTrans; },
                setVisible: function(visible) { _visible = visible; },
                getVisible: function() { return _visible; },

            };

            //Privates
            var _visible = true;
            var _polygonOffset = [0,0];
            var _isPolyOffsetActive;
            var _posBuf;
            var _modelTransform;
            var _indBuf;
            var _color;

            return _self;
        }
    }
});