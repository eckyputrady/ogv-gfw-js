define(
    ["./GLMatrix"],
    function() {
	
        return {
            create : function() {
			
                var _trans = mat4.create();
				
                var _self = {
                    pos 	: vec3.create([0,0,0]),
                    rot 	: vec3.create([0,0,0]),
                    scale	: vec3.create([1,1,1]),
                    update	: function() {
                        mat4.identity(_trans);
                        mat4.translate(_trans, this.pos, _trans);
                        mat4.rotateX(_trans, this.rot[0], _trans);
                        mat4.rotateY(_trans, this.rot[1], _trans);
                        mat4.rotateZ(_trans, this.rot[2], _trans);
                        mat4.scale(_trans, this.scale, _trans);
                    },
                    getMatrix : function() {
                        return _trans;
                    }
                };

                _self.update();

                return _self;
            }
        };
    }
    );