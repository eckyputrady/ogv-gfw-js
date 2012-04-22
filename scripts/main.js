require(
[
    "jquery",
    "framework/graphic/WebGL",
    "framework/Util",
    "framework/Timer",
    "framework/input/Input",
    "render/buffer/BufferMaker",
    "render/basic/BasicRenderSyst",
    "render/outline/OutlineRenderSyst",
    "render/pick/PickRenderSyst",
    "framework/graphic/Light",
    "framework/cam/Cam",
    "framework/cam/behavior/CamOrbit",
    "framework/asset/AssetSyst",
    "framework/FPSLogger",
],
function(
    $, WebGL,
    fwUtil,
    Timer,
    Input,
    BufferMaker,
    BasicRenderSyst,
    OutlineRenderSyst,
    PickRenderSyst,
    Light,
    Cam,
    CamOrbit,
    AssetSyst,
    FPSLogger
) {
    //Set basic things
    fwUtil.boilerPlate();

    //Create things
    var timer = Timer.create();
    var fpslogger = FPSLogger.create();

    //Initialize input
    Input.init($('canvas'), timer);

    //Renderers
    var basicRS = BasicRenderSyst.create().init();
    var outlineRS = OutlineRenderSyst.create().init();
    var pickRS = PickRenderSyst.create().init();

    //Renderers settings
    var light = Light.create();
    basicRS.setLight(light);
    basicRS.setFog(3.0, [0.53, 0.53, 0.53, 1]);
    outlineRS.setFog(3.0, [0.53, 0.53, 0.53, 1]);

    //Cam
    var cam = Cam.create();
    var camOrbit = CamOrbit.create(cam);
    camOrbit.distance = 300;

    //load teapot model
    $.getJSON('model/teapot.json', function(data){
        function createTeapot(idx) {
            //Create buffers
            var gl = WebGL.gl;
            var bufPos = BufferMaker.create(gl.ARRAY_BUFFER, Float32Array, 3).init();
            var bufNormal = BufferMaker.create(gl.ARRAY_BUFFER, Float32Array, 3).init();
            var bufIndices = BufferMaker.create(gl.ELEMENT_ARRAY_BUFFER, Uint16Array, 1).init();
            var bufTexCoord = BufferMaker.create(gl.ARRAY_BUFFER, Float32Array, 2).init();

            //Add data to buffer
            bufPos.add(data.pos);
            bufNormal.add(data.normal);
            bufIndices.add(data.indices);
            bufTexCoord.add(data.texCoord);

            //Flush buffers
            bufPos.flush();
            bufNormal.flush();
            bufIndices.flush();
            bufTexCoord.flush();

            //Model transform
            modelTrans = mat4.translate(mat4.identity(), [Math.random()*100, Math.random()*100, Math.random()*100]);

            //Create basic render batch
            var renderBatch = basicRS.createRenderBatch();
            renderBatch.init(bufPos, bufNormal, bufTexCoord, bufIndices);
            renderBatch.setTexture(AssetSyst.get('compass.png'));
            renderBatch.setModelTransform(modelTrans);

            //Create outlines
            var outlineRB = outlineRS.createRenderBatch();
            outlineRB.init(bufPos, bufIndices);
            outlineRB.setModelTransform(modelTrans);
            outlineRB.setColor([0,0,0,1]);

            //Create pick
            var pickRB = pickRS.createPickUnit();
            pickRB.init(bufPos, bufIndices);
            pickRB.setModelTransform(modelTrans);
            pickRB.userData = idx;
            pickRB.addPickListener(function(pickUnit){
                console.log("Picked: ");
                console.log(pickUnit);
            });
        }

        for(var i = 0; i < 100; ++i) {
            createTeapot(i);
        }
    }); 

    //Main loop
    function run() {
        //Update timer
        timer.update();

        //update fps
        fpslogger.update(timer.getLastDelta());

        //Update app
        camOrbit.update(timer.getLastDelta());

        //Pick
        if(Input.wasClicked()) {
            pickRS.pick(cam, true);
        }

        //Render
        WebGL.gl.clearColor(0.53, 0.53, 0.53, 1);
        WebGL.gl.clear(WebGL.gl.COLOR_BUFFER_BIT | WebGL.gl.DEPTH_BUFFER_BIT);
        basicRS.render(cam);
        outlineRS.render(cam);

        //Update input
        Input.update();
        
        //Request next frame
        requestAnimFrame(run);
    }

    //Kickstart main loop
    run();
});
