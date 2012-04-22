define(
    ["framework/graphic/WebGL"],
    function(WebGL) {
        return {
            create: function() {
                var _offset;
                var _length;
                var _bufMaker;

                var _self = {
                    init: function(offset, length, bufMaker) {
                        //Assign members
                        _offset = offset;
                        _length = length;
                        _bufMaker = bufMaker;

                        //Return me
                        return this;
                    },

                    destroy: function() {
                        
                    },

                    /**
                     * newData: array of data that will replace old data.
                     * if newData.length < oldData.length, the remainder data will
                     * remain.
                     * if newData.length > oldData.length, only as many as oldData.length
                     * will be changed (no append)
                     */
                    changeData: function(newData) {
                        //Get buffers
                        var buf = _bufMaker.getBuffer();
                        var target = _bufMaker.getTarget();

                        //Get GL
                        var gl = WebGL.gl;

                        //Transfer new data to GPU
                        newData = new (_bufMaker.getDataType())(newData);
                        gl.bindBuffer(target, buf);
                        gl.bufferSubData(target, _offset, newData);
                    },


                    changeAllData: function(newValue) {
                        //Build the new data
                        var newData = [];
                        for(var i = 0; i < _length; ++i) {
                            newData[i] = newValue;
                        }

                        //Change the data
                        _self.changeData(newData);
                    }
                };

                return _self;
            }
        };
    }
    );