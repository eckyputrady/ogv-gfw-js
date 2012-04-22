define(function() {

    return {
        loadState : {
            NOT_LOADED 	: 0,
            LOADING     : 1,
            LOADED	: 2
        },
		
        create : function(path) {
		
            var _count      = 0;
            var _path       = path;
            var _callbacks  = []; //list of callbacks
            var _CLASS      = this;
		
            var _self = {
                loadState : _CLASS.loadState.NOT_LOADED,
			
                incRef : function(callback, params) {
                    //Register callback if necessary
                    if(callback) {
                        callback.params = params;
                        _callbacks.push(callback);
                    }

                    //Load if necessary
                    if(++_count == 1 && this.loadState == _CLASS.loadState.NOT_LOADED) {
                        //begin loading
                        this.loadState = _CLASS.loadState.LOADING;
                        this.load();
                    }

                    //Immediately call callback if this asset is loaded
                    else if(_self.loadState == _CLASS.loadState.LOADED) {
                        _self.doneLoading();
                    }
                },
				
                decRef : function() {
                    //Unload if necessary
                    if(--_count == 0 && this.loadState == _loadState.LOADED) {
                        this.unload();
                    }
                },
				
                getPath : function() {
                    return _path;
                },

                /**
                 * Subclass should call this function after finish loading
                 */
                doneLoading : function() {
                    //Set loadstate
                    this.loadState = _CLASS.loadState.LOADED;

                    //Trigger all callbacks and clear it
                    for(var i in _callbacks) {
                        _callbacks[i](this, _callbacks[i].params);
                    }
                    _callbacks.splice(0, _callbacks.length);
                },

                /**
                 * Subclass should call this function before start unloading
                 */
                beginUnloading : function() {
                    this.loadState = _CLASS.loadState.NOT_LOADED;

                    //Just to make sure
                    _count = 0; 
                    _callbacks.splice(0, _callbacks.length);
                },
				
                isLoaded : function() {
                    return this.loadState === _CLASS.loadState.LOADED;
                }
            };

            return _self;
        }
    };
});