define(
["framework/graphic/WebGL"],
function(WebGL){
    return {
        create: function(colorCode, id) {

            var _self = {

                init: function(bufPos, bufInd) {
                    _posBuf = bufPos;
                    _indBuf = bufInd;
                },

                destroy: function() {

                },

                render: function(shader) {
                    //Assign the buffers
                    WebGL.pointAttrib(shader.getAttribute("aPos"), _posBuf.getBuffer());

                    //Model transform
                    WebGL.gl.uniformMatrix4fv(shader.getUniform("uMMat"), false, _modelTransform);
                    
                    //Get gl
                    var gl = WebGL.gl;
                    
                    //Set color    
                    gl.uniform3fv(shader.getUniform("uColor"), _colorCode);

                    //Draw call
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indBuf.getBuffer());
                    gl.drawElements(gl.TRIANGLES, _indBuf.getNumItems(), gl.UNSIGNED_SHORT, 0);
                },

                addPickListener: function(F_pick) {
                    _pickListeners.push(F_pick);
                },

                remPickListener: function(F_pick) {
                    var idx = _pickListeners.indexOf(F_pick);
                    if(idx >= 0) {
                        _pickListeners.splice(idx, 1);
                    }
                },

                triggerPickListeners: function() {
                    for(var idx in _pickListeners)
                        _pickListeners[idx](_self);
                },

                setModelTransform: function(modelTransform) {
                    _modelTransform = modelTransform;
                }
            };

            var _posBuf;
            var _indBuf;
            var _pickListeners = [];
            var _colorCode = colorCode;
            var _pickId = id;
            var _modelTransform;

            return _self;
        }
    };
});