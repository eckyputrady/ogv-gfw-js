define(
    ["./webgl-utils"],
    function(webglUtil) {
	
        var webgl = {
            //Initialize webgl, return null if succeed
            init: function(canvas, fullscreen) {
                //Set canvas to fullscreen
                _fullscreen = fullscreen
                if(_fullscreen) {
                    canvas.width 	= $(document).width();
                    canvas.height   = $(document).height();
                } else {
                    canvas.width 	= $(canvas).width();
                    canvas.height   = $(canvas).height();
                }
			
                //Initialize
                this.gl             = webglUtil.setupWebGL(canvas, {preserveDrawingBuffer: true});
                this.viewportWidth 	= canvas.width;
                this.viewportHeight	= canvas.height;
			
                //common settings
                this.gl.viewport(0,0,webgl.viewportWidth,webgl.viewportHeight);

                //Clear color
                this.gl.clearColor(0.53, 0.53, 0.53, 1);

                //Depth test / z-Buffer
                this.gl.enable(this.gl.DEPTH_TEST);

                //Blending
                this.gl.enable(this.gl.BLEND);
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

                //Backface culling
                this.gl.enable(this.gl.CULL_FACE);
                this.gl.frontFace(this.gl.CCW);
                this.gl.cullFace(this.gl.BACK);
			
                return this.gl;
            },

            getAspectRatio: function() {
                return this.viewportWidth / this.viewportHeight;
            },
		
            //Helper function to create buffer
            //ex: createStaticBuf(webgl.gl.ARRAY_BUFFER, Float32Array, [0,0,0, 0,1,0, 1,1,0], 3)
            createStaticBuf: function(bufType, dataType, data, itemSize) {
                var gl	= this.gl;
                var buf = gl.createBuffer();
                gl.bindBuffer(bufType, buf);
                gl.bufferData(bufType, new dataType(data), gl.STATIC_DRAW);
                buf.itemSize = itemSize;
                buf.numItems = data.length / itemSize;
                return buf;
            },
		
            //Helper function to point attribute arr
            //loc: get it from shader's attribute
            //buf: buffer created from createStaticBuf()
            pointAttrib: function(loc, buf, stride, offset) {
                var gl = this.gl;
                stride = !stride ? 0 : stride;
                offset = !offset ? 0 : offset
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.vertexAttribPointer(loc, buf.itemSize, gl.FLOAT, false, stride, offset);
            }
        };
	
        return webgl;
    }
);