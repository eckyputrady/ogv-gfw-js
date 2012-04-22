/**
 * Basic renderer - given pos, indices, normal, tex idx, tex coord
 */
define(
["framework/graphic/WebGL", "framework/asset/AssetSyst", "./OutlineRenderBatch"],
function(WebGL, AssetSyst, OutlineRenderBatch) {
    return {

        create: function() {
            var _batches = [];
            var _shader = AssetSyst.get("vOutline|fOutline|shader.sp");
            var _fogColor;
            var _fogPower;

            var _self = {

                init: function() {
                    //Does nothing

                    return _self;
                },

                destroy: function() {
                    //Release shader
                    AssetSyst.let(_shader);

                    //TODO Destroy all batch
                },
                
                createRenderBatch: function() {
                    var batch = OutlineRenderBatch.create();
                    _batches.push(batch);
                    return batch;
                },

                destroyRenderBatch: function(batch) {
                    _batches.splice(_batches.indexOf(batch),1);
                    batch.destroy();
                },

                setFog: function(power, color) {
                    _fogColor = color;
                    _fogPower = power;
                },
                
                render: function(cam) {
                    //Skip if shader has not ready
                    if(!_shader.isLoaded())
                        return;

                    //Use program
                    WebGL.gl.useProgram(_shader.program);

                    WebGL.gl.lineWidth(5);

                    //Set camera and lights and other system-wide settings
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uVMat"), false, cam.getView());
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uPMat"), false, cam.getProjection());
                    WebGL.gl.uniform1f(_shader.getUniform("far"), cam.far);
                    WebGL.gl.uniform4fv(_shader.getUniform("fogColor"), _fogColor);
                    WebGL.gl.uniform1f(_shader.getUniform("fogPower"), _fogPower);

                    //Render each batch
                    for(var i = 0; i < _batches.length; ++i)
                        _batches[i].render(_shader);
                }
            };

            return _self;
        }
    };
});