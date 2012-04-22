define(
    ["./WebGL", "./../asset/AssetSyst", "./../asset/BaseAsset"],
    function(WebGL, AssetSyst, BaseAsset) {
        return {
	
            create : function(path) {
                var _splits     = (path.split('.')[0]).split('|');
                var _vs, _fs;
                var _uniforms   = [];
                var _attributes = [];
			
                //Create WebGL Shader Program
                function createProgram() {
                    //Link the shaders
                    var gl= WebGL.gl;
                    var p = gl.createProgram();
                    gl.attachShader(p, _vs.shader);
                    gl.attachShader(p, _fs.shader);
                    gl.linkProgram(p);

                    //Check linking status, unload if fail
                    if(!gl.getProgramParameter(p, gl.LINK_STATUS)) {
                        _self.unload();
                        throw ("assetShaderProgram.js : LINK SHADER FAILED!");
                        return false;
                    }
				
                    _self.program = p;
                    return true;
                }
			
                //Get attribute location
                function getAttrLoc(name) {
                    var a = WebGL.gl.getAttribLocation(_self.program, name);
                    WebGL.gl.enableVertexAttribArray(a);
                    return a;
                }
			
                function onShaderLoaded(shader) {
                    if(_vs.isLoaded() && _fs.isLoaded()) {
                        //Attempt to create program
                        if(createProgram()) {
                            _vs = _fs = _splits = null;
                            _self.doneLoading();
                        }
                    }
                }





                  
                var _self = BaseAsset.create(path);
			
                _self.program = null;
			
                _self.load = function() {
                    _vs = AssetSyst.get(_splits[0] + "." + _splits[2], onShaderLoaded);
                    _fs = AssetSyst.get(_splits[1] + "." + _splits[2], onShaderLoaded);
                };
			
                _self.unload = function() {
                    _self.beginUnloading();

                    if(!this.program) return;

                    //Destroy program
                    WebGL.gl.deleteProgram(this.program);
                    this.program = null;

                    //Release source assets
                    AssetSyst.let(_vs);
                    AssetSyst.let(_fs);
                };
			
                _self.getUniform = function(name) {
                    return  !_uniforms[name] ?
                    _uniforms[name] = WebGL.gl.getUniformLocation(_self.program, name) :
                    _uniforms[name];
                };
			
                _self.getAttribute = function(name) {
                    return  !_attributes[name] ?
                    _attributes[name] = getAttrLoc(name) :
                    _attributes[name];
                }
			
                return _self;
            }
        };
    }
);