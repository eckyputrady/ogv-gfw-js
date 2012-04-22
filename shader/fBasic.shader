#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNor;
varying vec3 vPos;
varying vec3 vTex;

uniform sampler2D sampler_0;

void main(void) {

    //Static, white directional light
    vec3 lDir = normalize(vec3(1.0,2.0,3.0));

    //Static material color
    vec4 mAmbient   = vec4(0.3,0.3,0.3,1.0);
    vec4 mDiffuse   = texture2D(sampler_0, vec2(vTex.y, vTex.z));

    gl_FragColor = mAmbient * mDiffuse + mDiffuse * max(0.0, dot(lDir, vNor));
}