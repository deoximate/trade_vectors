#include <commonMain>

in vec4 vColor;
in vec3 vPos;
in float vD;

vec3 col1 = vec3(98.0/255.0, 240.0/255.0, 214.0/255.0);
vec3 col2 = vec3(34.0/255.0, 157.0/255.0, 245.0/255.0);
vec3 col3 = vec3(28.0/255.0);

float LINE_SIZE = 0.01;


void main(){

    vec4 col = vec4(col3, 1.0);


    col.rgb = mix(col1, col2, vPos.y);
    col.rgb = mix(col3, col.rgb, vD);


    LINE_SIZE += vD*0.0001;

    if (vPos.x < 0.5-LINE_SIZE || vPos.x > 0.5+LINE_SIZE || vPos.y > 1.0-LINE_SIZE) {
        col.a = (0.0);
    }

    fragColor = vec4(col);

}