define(
    ["framework/graphic/WebGL", "render/buffer/BufferUnit"],
    function(WebGL, BufferUnit) {
        return {
            /**
             * target: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
             * dataType: data type of the buffer .. Float32Array, Uint16Array, etc
             * itemSize: position buffer has 3 itemSize (x,y,z)
             */
            create: function(target, dataType, itemSize) {
                var _dataType   = dataType;
                var _itemSize   = itemSize;
                var _target     = target;
                var _buf        = [];
                var _flushed    = false;
                var _dataCount  = 0;
                
                var _self = {
                    init: function() {
                        //TODO move constructor here

                        return _self;
                    },

                    destroy: function() {
                        //Destroy the buffer
                        if(_flushed)
                            WebGL.gl.deleteBuffer(_buf);

                        //Reset variables
                        _buf        = [];
                        _dataCount  = 0;
                    },

                    add: function(data, offset, len) {
                        //Error if this buffer is already flushed
                        if(_flushed)
                            throw "Buffer already flushed!";

                        //Get buffer offset
                        var bufOffset = _buf.length;

                        //Put all data into buf
                        offset = offset || 0;
                        len = len || data.length;
                        for(var i = 0; i < len; ++i)
                            _buf.push(data[i + offset]);

                        //Update data count
                        _dataCount = _buf.length;

                        //Create and return BufferUnit
                        return BufferUnit.create().init(bufOffset, len, _self);
                    },

                    getDataCount: function() {
                        return _dataCount;
                    },

                    getItemSize: function() {
                        return _itemSize;
                    },

                    getNumItems: function() {
                        return _dataCount/_itemSize;
                    },

                    /**
                     * Put the buffer into GPU
                     */
                    flush: function() {
                        //Error if this buffer is already flushed
                        if(_flushed)
                            throw "Buffer already flushed!";

                        //Flush the buffer
                        _flushed = true;
                        _buf = WebGL.createStaticBuf(_target, _dataType, _buf, _itemSize);
                    },

                    getBuffer: function() {
                        return _buf;
                    },

                    getTarget: function() {
                        return _target;
                    },

                    getDataType: function() {
                        return _dataType;
                    }
                };

                return _self;
            }
        };
    }
    );