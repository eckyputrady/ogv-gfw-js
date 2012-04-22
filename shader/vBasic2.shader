#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aTex;

//Basic
uniform mat4 uVMat;
uniform mat4 uMMat;
uniform mat4 uPMat;

varying vec3 vPos;
varying vec3 vNor;
varying vec2 vTex;
  
void main(void) {
	vPos			= aPos;
	vNor			= aNor;
	vTex			= aTex;
	gl_Position 	= uPMat * uVMat * uMMat * vec4(aPos, 1.0);
}	