attribute vec3 aPos;

//Basic
uniform mat4 uMMat;
uniform mat4 uVMat;
uniform mat4 uPMat;

void main(void) {
    gl_Position = uPMat * uVMat * uMMat * vec4(aPos, 1.0);
}