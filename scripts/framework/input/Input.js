/**
Poll-based input module. Might be useful for certain requirements.
ex:
    var t = Timer.create();
    Input.init($('canvas'), t);

    function mainLoop() {
        // .. Do your processing
        if(Input.wasClicked())
            alert("clicked at " + Input._pos[0] + ", " + Input._pos[1]);

        //Update at the *END* of frame
        Input.update();
    }
*/

define(
    function() {
        var _target;
        var _whenClick = 0;
        var _timer;
        var _pos = [0, 0];
        var _deltaPos = [0, 0];
        var _state = 0;
        var _wasClicked = false;
        var _keyFlag = [];
        var _shiftKey = false;
        var CLICK_THRESHOLD = 500;
		
        function _getPosFromEvt(evt, element) {
            _pos[0] = evt.pageX - element.offsetLeft;
            _pos[1] = evt.pageY - element.offsetTop;
        }
		
        function _onMouseDown(evt) {
            _state = 1;
            whenClick = _timer.getLastTime();
            _getPosFromEvt(evt, this);
        }
		
        function _onMouseUp(evt) {
            _state = 3;
            _getPosFromEvt(evt, this);
            if(_timer.getLastTime() - whenClick < CLICK_THRESHOLD)
                _wasClicked = true;
        }
		
        function _onMouseMove(evt) {
            _deltaPos[0] = (evt.pageX - this.offsetLeft) - _pos[0];
            _deltaPos[1] = (evt.pageY - this.offsetTop) - _pos[1];
            _getPosFromEvt(evt, this);
        }
		
        function _onKeyDown(evt) {
            _keyFlag[evt.which] = true;
            _shiftKey = evt.shiftKey;
        }
		
        function _onKeyUp(evt) {
            _keyFlag[evt.which] = false;
            _shiftKey = evt.shiftKey;
        }
	
        return {
            state: function() {
                return _state;
            }, //0 = up, 1 = just down, 2 = down, 3 = just up
            wasClicked: function() {
                return _wasClicked;
            },
            shiftKey: function() {
                return _shiftKey;
            },
            pos: _pos,
            deltaPos: _deltaPos,
			
            init: function(jqElement, timer) {
                if(_target)
                    detach(_target);
					
                _target = jqElement;
                _target.mousedown(_onMouseDown);
                _target.mouseup(_onMouseUp);
                _target.mousemove(_onMouseMove);
                $(document).keydown(_onKeyDown);
                $(document).keyup(_onKeyUp);
				
                _timer = timer;
            },
			
            isPressed: function(keyCode) {
                return _keyFlag[keyCode];
            },
			
            //This function should be called each frame at the *END* of the frame
            //otherwise, _state == 1 and == 3 can not be retrieved
            update: function() {
                _deltaPos[0] = 0;
                _deltaPos[1] = 0;
                _wasClicked = false;
                if(_state == 1)
                    _state = 2;
                else if(_state == 3)
                    _state = 0;
            }
        };
    }
);