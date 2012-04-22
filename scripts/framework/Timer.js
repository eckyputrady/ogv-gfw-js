define(function() {
    return {
        create : function() {
			
            var _delta 		= 0;
            var _lastTime 	= Date.now();
			
            return {
                update: function() {
                    var now = Date.now();
                    _delta = (now - _lastTime)/1000;
                    _lastTime = now;
                },
				
                reset: function() {
                    _lastTime = Date.now();
                },
				
                getLastDelta: function() {
                    return _delta;
                },

                getLastTime: function() {
                    return _lastTime;
                }
            };
        }
    };
});