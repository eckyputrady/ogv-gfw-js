define(
    ["./../asset/BaseAsset", "./WebGL"],
    function(BaseAsset, WebGL) {
        return {
            create : function(path) {

                function _getShaderType() {
                    var type = _self.getPath().charAt(_self.getPath().lastIndexOf('/') + 1);
                    return type === 'v' ? WebGL.gl.VERTEX_SHADER : WebGL.gl.FRAGMENT_SHADER;
                }
			
                function _processSource(txt) {
                    //Compile it
                    var gl      = WebGL.gl;
                    _self.shader= gl.createShader(_getShaderType());
                    gl.shaderSource(_self.shader, txt);
                    gl.compileShader(_self.shader);
				
                    //Check for error
                    if (!gl.getShaderParameter(_self.shader, gl.COMPILE_STATUS)) {
                        var log = gl.getShaderInfoLog(_self.shader);
                        _self.unload();
                        throw ("Shader.js : " + log);
                    }
				
                    //Succeed
                    else {
                        _self.doneLoading();
                    }
                }

                
                var _self = BaseAsset.create(path);
			
                _self.shader = null;
			
                _self.load = function() {
                    $.get(this.getPath(), _processSource);
                };
			
                _self.unload = function() {
                    this.beginUnloading();

                    //Destroy the shader if necessary
                    if(!this.shader) return;
                    WebGL.gl.deleteShader(this.shader);
                    this.shader = null;
                };
			
                return _self;
            }
        };
    }
);