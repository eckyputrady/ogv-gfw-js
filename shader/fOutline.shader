#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;

//fog
uniform float far;
uniform vec4 fogColor;
uniform float fogPower;

void main(void) {
    gl_FragColor = uColor;

    //Fog!
    const float LOG2 = 1.442695;
    float z = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = exp2( -fogPower/far * 
                       fogPower/far * 
                       z * 
                       z * 
                       LOG2 );
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    gl_FragColor = mix(fogColor, gl_FragColor, fogFactor);
}