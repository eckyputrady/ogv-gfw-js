#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNor;
varying vec3 vPos;
varying vec2 vTex;

//Texture
uniform sampler2D sampler_0;
uniform int useTexture;

//Lights
uniform vec3 uLDir;
uniform vec4 uLAmbient;
uniform vec4 uLDiffuse;
uniform vec4 uLSpecular;
uniform vec3 uCamPos;

//Material
uniform vec4 uMAmbient;
uniform vec4 uMDiffuse;
uniform vec4 uMSpecular;
uniform float uMSpecPow;

//fog
uniform float far;
uniform vec4 fogColor;
uniform float fogPower;

void main(void) {
	//Params
    vec3 norm = normalize(vNor);
    vec3 lDir = -normalize(uLDir);
    vec3 toEye= -normalize(uCamPos - vPos);

    //compute diffuse
    vec4 diffuse = max(dot(norm, -lDir), 0.0) * (uMDiffuse * uLDiffuse);

    //compute specular
    vec3 r = reflect(lDir, norm);
    vec4 specular = pow(max(dot(toEye, r), 0.0), uMSpecPow) * (uMSpecular * uLSpecular);

    //compute ambient
    vec4 ambient = (uMAmbient * uLAmbient);

    //fog
    float fog = min(1.0, 2.0 - (vPos.z+1.0));

    //Final color
    gl_FragColor = 
    	(ambient + diffuse + specular) * 
    	(useTexture == 0 ? vec4(1.0,1.0,1.0,1.0) : texture2D(sampler_0, vTex));

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