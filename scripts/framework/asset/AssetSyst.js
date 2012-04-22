define(function() {

    //the assets
    var _assets             = [];
    var _extFolderClassMap  = []; // ".jpg" => ['tex', Texture]
	
    function _getExtension(name) {
        return name.substring(name.lastIndexOf('.') + 1);
    }
	
    function _resolvePath(name) {
        //return absolute path if HTTP
        if(name.match(/^http:\/\//))
            return name;

        //Else, resolve
        var ext         = _getExtension(name);
        var folderPath  = (_extFolderClassMap[ext])[0];
        return folderPath + name;
    }
	
    function _resolveClass(name) {
        var ext = _getExtension(name);
        return (_extFolderClassMap[ext])[1];
    }
	
    var _self = {
		
        //Map extension to folder and class
        //ex: mapExt("jpg", "/texture/", Texture)
        mapExt : function(extName, extFolder, assetClass) {
            _extFolderClassMap[extName] = [extFolder, assetClass];
        },
		
        /**
         * Get the asset, will auto load if necessary
         * name:
         *  the name of the asset, ex: "texture.png"
         *
         * callback:
         *  the function that will be called when loading finished.
         *  Will be called immediately if asset is already loaded.
         *  signature: function(asset, params)
         *
         * params:
         *  the parameters that will be passed to callback
         */
        get : function(name, callback, params) {
            //Get the asset
            var asset 	= _assets[name];

            //Create the asset if necessary
            if(!asset) {
                var path 	= _resolvePath(name);
                var assetCl	= _resolveClass(name);
                _assets[name] = asset = assetCl.create(path);
            }
            
            //Increase reference, may load the asset
            asset.incRef(callback, params);

            //Return it for use
            return asset;
        },
		
        //Release asset
        let : function(asset) {
            asset.decRef();
        }
    };

    return _self;
});