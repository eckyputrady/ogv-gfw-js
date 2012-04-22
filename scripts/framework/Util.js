define(
    [
        "jquery",
        "./asset/AssetSyst",
        "./graphic/Shader", "./graphic/ShaderProgram", "./graphic/Texture",
        "./graphic/WebGL",
        "./math/CMath"
    ],
    function(
        $,
        AssetSyst,
        Shader, ShaderProgram, Texture,
        WebGL
    ) {
        return {
            mapBasicAssets: function() {
                AssetSyst.mapExt("png", "./texture/", Texture);
                AssetSyst.mapExt("shader", "./shader/", Shader);
                AssetSyst.mapExt("sp", "", ShaderProgram);
            },

            boilerPlate: function() {
                WebGL.init($('canvas')[0], false);
                this.mapBasicAssets();
            }
        }
    }
);