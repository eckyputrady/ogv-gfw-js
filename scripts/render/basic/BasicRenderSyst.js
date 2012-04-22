/**
 * Basic renderer - given pos, indices, normal, tex idx, tex coord
 */
define(
["framework/graphic/WebGL", "framework/asset/AssetSyst", "./BasicRenderBatch"],
function(WebGL, AssetSyst, BasicRenderBatch) {
    return {

        create: function() {
            var _batches = [];
            var _shader = AssetSyst.get("vBasic2|fBasic2|shader.sp");
            var _light;
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
                    var batch = BasicRenderBatch.create();
                    _batches.push(batch);
                    return batch;
                },

                destroyRenderBatch: function(batch) {
                    _batches.splice(_batches.indexOf(batch),1);
                    batch.destroy();
                },

                setLight: function(light) {
                    _light = light;
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

                    //Set camera and lights and other system-wide settings
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uVMat"), false, cam.getView());
                    WebGL.gl.uniformMatrix4fv(_shader.getUniform("uPMat"), false, cam.getProjection());
                    WebGL.gl.uniform3fv(_shader.getUniform("uLDir"), _light.dir);
                    WebGL.gl.uniform4fv(_shader.getUniform("uLAmbient"), _light.color.ambient);
                    WebGL.gl.uniform4fv(_shader.getUniform("uLDiffuse"), _light.color.diffuse);
                    WebGL.gl.uniform4fv(_shader.getUniform("uLSpecular"), _light.color.specular);
                    WebGL.gl.uniform3fv(_shader.getUniform("uCamPos"), cam.pos);
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