define(["./../asset/baseAsset", "./WebGL"], function(baseAsset, WebGL) {
    return {
        create : function(path) {

            var _glTex;
			
            function _onImageLoaded() {
                _self.doneLoading();
            }
		
            var _self = baseAsset.create(path);
			
            _self.load = function(callback, params) {				
                //load the image actually
                _self.img = new Image();
                _self.img.crossOrigin = 'anonymous';
                _self.img.onload = _onImageLoaded;
                _self.img.src = _self.getPath();
            };
			
            _self.unload = function() {
                _self.beginUnloading();
                _self.destroyFromGL();
                _self.img = null;
            };

            _self.uploadToGL = function() {
                //Check validity
                if(_glTex || !_self.isLoaded())
                    return;

                //Check POT
                var sizePOT =   Math.nearestPowerOf(2, _self.getWidth()) == _self.getWidth() ||
                                Math.nearestPowerOf(2, _self.getHeight()) == _self.getHeight();
                if(!sizePOT) 
                    throw "Size is not POT! Texture won't be displayed!";

                //Upload to GL
                var gl = WebGL.gl;
                _glTex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, _glTex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _self.img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };

            _self.destroyFromGL = function() {
                //Check validity
                if(!_glTex)
                    return;

                //Upload to GL
                throw "asset/texture.js - destroygromGL - not yet implemented"
            };

            _self.getGLTex = function() { return _glTex; }

            _self.getWidth = function() { return _self.img.width; }

            _self.getHeight= function() { return _self.img.height; }
			
            return _self;
        }
    };
});