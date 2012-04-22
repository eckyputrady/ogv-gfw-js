#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPos;
attribute vec3 aNor;
attribute vec3 aTex;

//Basic
uniform mat4 uVMat;
uniform mat4 uPMat;

varying vec3 vPos;
varying vec3 vNor;
varying vec3 vTex;
  
void main(void) {
	vPos			= aPos;
	vNor			= aNor;
	vTex			= aTex;
	gl_Position 	= uPMat * uVMat * vec4(aPos, 1.0);
}	