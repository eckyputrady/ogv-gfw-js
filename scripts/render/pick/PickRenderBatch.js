define(
["./PickRenderSyst", "./PickUnit", "framework/graphic/WebGL"],
function(PickRenderSyst, PickUnit, WebGL){
    return {
        create: function() {

            var _self = {

                init: function() {
                    //Get and register myself to the system

                    return _self;
                },

                destroy: function() {
                    throw "not implemented";
                },

                /**
                 * Call this to draw to the screen
                 */
                render: function(shader, x, y) {
                    //Clear color
                    WebGL.gl.clear(WebGL.gl.COLOR_BUFFER_BIT);

                    //Render each unit
                    _pickUnits.forEach(function(unit){
                        unit.render(shader);
                    });

                    //Get picked unit
                    return _getPickedUnit(x, y);
                },

                createPickUnit: function() {
                    //Get new color
                    //TODO reuse unused color
                    var color = _incColorCode();
                    if(!color)
                        return false;

                    //Get id
                    var id = _colorToId(color);

                    //Create unit
                    var unit = PickUnit.create(_colorMap255to1(color), id);

                    //Register unit
                    _pickUnits[id] = unit;

                    //Return created unit
                    return unit;
                },
            };

            var _pickUnits = [];
            var _colorCode = [0,0,1];
            var _tempPixel = new Uint8Array(4);

            function _incColorCode() {
                var increment = 1;
                _colorCode[2] += increment;
                if(_colorCode[2] > 255) {
                    _colorCode[2] = 0;
                    _colorCode[1] += increment;
                    if(_colorCode[1] > 255) {
                        _colorCode[1] = 0;
                        _colorCode[0] += increment;
                        if(_colorCode[0] > 255) {
                            return false; //Color code run out
                        }
                    }
                }

                return _colorCode;
            }

            function _colorToId(color) {
                return color[2] + color[1] * 256 + color[0] * 256 * 256;
            }

            function _colorMap255to1(color) {
                return color.map(function(val){return val/255;});
            }

            function _getPickedUnit(x, y) {
                //Get color
                var color = _tempPixel;
                WebGL.gl.readPixels(
                    x, y,
                    1, 1,
                    WebGL.gl.RGBA, WebGL.gl.UNSIGNED_BYTE, color
                );

                //Translate to id
                var id = _colorToId(color);

                //Get pick unit
                return _pickUnits[id];
            }

            return _self;
        }
    }
});