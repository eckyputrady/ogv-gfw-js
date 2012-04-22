#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTex;

uniform sampler2D sampler_0;

void main(void) {
    gl_FragColor = texture2D(sampler_0, vTex);
}