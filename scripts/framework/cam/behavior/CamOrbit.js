define(
    ["./../../input/Input", "./../../math/GLMatrix"],
    function(input) {
        return {
            create : function(ccam) {
                var _ZOOM_BTN 	= ('Q').charCodeAt(0);
                var _ROT_BTN 	= 17; //ctrl
			
                function _updateCamPos() {
                    //Compute position
                    var cosRot = Math.cos(_inst.rotation);
                    var sinRot = Math.sin(_inst.rotation);
                    var cosEle = Math.cos(_inst.elevation);
                    var sinEle = Math.sin(_inst.elevation);
                    var x = _inst.distance * sinRot * sinEle + _inst.target[0];
                    var y = _inst.distance * cosEle + _inst.target[1];
                    var z = _inst.distance * sinEle * cosRot + _inst.target[2];
					
                    //Set the position
                    _inst.cam.pos[0] = x;
                    _inst.cam.pos[1] = y;
                    _inst.cam.pos[2] = z;
					
                    //Update the camera
                    _inst.cam.update();
                }
				
                function _updateBasedOnInput(delta) {
                    if(input.state() == 2) {
						
                        //distance
                        if(input.shiftKey() || input.isPressed(_ZOOM_BTN)) {
                            _inst.distance += delta * input.deltaPos[1] * 50;
                            _inst.distance = Math.min(_inst.maxDist, Math.max(_inst.minDist, _inst.distance)); //cap
                        }
						
                        //rot and elevation
                        else if(input.isPressed(_ROT_BTN)) {
                            _inst.rotation += delta * input.deltaPos[0];
                            _inst.elevation -= delta * input.deltaPos[1];
                            _inst.elevation = Math.min(_inst.maxElevation, Math.max(_inst.minElevation, _inst.elevation)); //cap
                        }
						
                        //target position
                        else {
                            //Assign shorthand vars
                            var t = _inst.target;
                            var c = _inst.cam;
                            var temp = vec3.create();

                            //Left right movement
                            var dx = vec3.scale(c.right, delta * input.deltaPos[0] * 50, temp);
                            vec3.add(t, dx);

                            //Copy forward to temp, zero the y component
                            var dz = vec3.scale(c.forward, 1, temp);
                            dz[1] = 0;

                            //Forward & backward movement
                            vec3.normalize(dz);
                            vec3.scale(dz, delta * input.deltaPos[1] * 50);
                            vec3.add(t, dz);
                        }
                    }
                }
			
                var _inst = {
                    cam: ccam,
                    target: ccam.target,
                    distance: 10,
                    elevation: Math.PI * 0.25,
                    rotation: Math.PI * 0,
                    maxDist: 5000,
                    minDist: 10,
                    maxElevation: 0.48 * Math.PI,
                    minElevation: 0.02 * Math.PI,
                    update: function(delta) {
                        _updateBasedOnInput(delta);
                        _updateCamPos();
                    }
                };

                return _inst;
            }
        };
    }
    );
