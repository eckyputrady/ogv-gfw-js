define(
    [ "./../graphic/WebGL", "./../math/GLMatrix"],
    function(WebGL) {
        return {
            create	: function() {
			
                var _self = {
                    pos     : vec3.create([0,0,200]),
                    target  : vec3.create([0,0,0]),
                    up      : vec3.create([0,1,0]),
                    fov     : 45,
                    near    : 0.1,
                    far     : 1000,
                    aspect  : WebGL.getAspectRatio(),
                    forward : vec3.create([0,0,0]),
                    right   : vec3.create([0,0,0]),

                    isOrtho : false,
                    orthoL  : WebGL.viewportWidth/-2,
                    orthoR  : WebGL.viewportWidth/2,
                    orthoB  : WebGL.viewportHeight/-2,
                    orthoT  : WebGL.viewportHeight/2,

                    update  : function() {
                        mat4.lookAt(this.pos, this.target, this.up, _view);
                        vec3.subtract(this.target, this.pos, this.forward);
                        vec3.normalize(this.forward);
                        vec3.cross(this.up, this.forward, this.right);
                        vec3.normalize(this.right);
                    },

                    updateView: function() {
                        if(_self.isOrtho)
                            mat4.ortho(_self.orthoL, _self.orthoR, _self.orthoB, _self.orthoT, _self.near, _self.far, _proj);
                        else
                            mat4.perspective(this.fov, this.aspect, this.near, this.far, _proj);
                    },

                    getView : function() {
                        return _view;
                    },

                    getProjection : function() {
                        return _proj;
                    }
                };

                var _proj   = mat4.create();
                var _view   = mat4.create();

                _self.updateView();
                _self.update();

                return _self;
            }
        };
    }
    );