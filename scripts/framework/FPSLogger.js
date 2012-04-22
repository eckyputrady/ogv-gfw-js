define(
[],
function(){
    return {
        create: function() {
            var _frame = 0;
            var _dur = 0;
            var _fps = $('#FPS');

            return {
                update: function(delta) {
                    ++_frame;
                    _dur += delta;
                    if(_dur > 1) {
                        _fps.text(_frame);
                        _dur -= 1;
                        _frame= 0;
                    }
                }
            };
        }
    };
}
);