define(
    [],
    function() {
        /**
        Lights. Currently only support dir light. point and cone will be supported soon
        */
        return {
            create: function() {
                
                var _self = {
                    dir: [-1,-1,-1],

                    color: {
                        ambient: [1,1,1,1],
                        diffuse: [1,1,1,1],
                        specular: [1,1,1,1]
                    }
                };

                return _self;
            }
        };
    }
    );