define(
["framework/input/Input", "framework/graphic/WebGL", "framework/asset/AssetSyst", "./PickRenderBatch"],
function(Input, WebGL, AssetSyst, PickBatch) {
    return {

        create: function() {
            var _batches = [];
            var _shader = AssetSyst.get("vPick|fPick|shader.sp");

            var _self = {

                init: function() {
                    //Does nothing

                    return _self;
                },

                destroy: function() {
                    throw "not implemented";

                    //Release shader
                    AssetSyst.let(_shader);

                    //TODO Destroy all batch
                },
                
                createPickUnit: function() {
                    //Traverse pickbatches and try to create pick unit
                    for(var i = _batches.length - 1; i >= 0; --i) {
                        var unit = _batches[i].createPickUnit();
                        if(unit)
                            return unit;
                    }

                    //If code reach here, then all batches full
                    //create new batch!
                    var batch = PickBatch.create().init();
                    var unit = batch.createPickUnit();
                    _batches.push(batch);
                    return unit;
                },

                destroyPickUnit: function(unit) {
                    throw "not implemented";
                },

                pick: function(cam, useMouse, x, y) {
                    //Skip if shader has not ready
                    if(!_shader.isLoaded())
                        return;

                    //Fix x, y if mouse is used
                    if(useMouse) {
                        x = Input.pos[0];
                        y = WebGL.viewportHeight - Input.pos[1];
                    }

                    //Use program
                    WebGL.gl.useProgram(_shader.program);

                    //Set camera and lights and other system-wide settings
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uVMat"), false, cam.getView());
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uPMat"), false, cam.getProjection());

                    //Settings & clear depth
                    WebGL.gl.clearColor(0,0,0,1);
                    WebGL.gl.clear(WebGL.gl.DEPTH_BUFFER_BIT);
                    var pickedUnit = null;

                    //For each batch
                    _batches.forEach(function(pickBatch) {
                        var p = pickBatch.render(_shader, x, y);
                        if(p) pickedUnit = p;
                    });

                    //If picked unit available, something is picked. Trigger callbacks
                    if(pickedUnit)
                        pickedUnit.triggerPickListeners();
                }
            };

            var _batches = [];

            return _self;
        }
    };
});