attribute vec3 aPos;
attribute vec2 aTex;

//Basic
uniform mat4 uPMat;
uniform mat4 uMMat;

varying vec2 vTex;

void main(void) {
    vTex        = aTex;
    gl_Position = uPMat * uMMat * vec4(aPos, 1.0);
}