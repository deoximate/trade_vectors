#include <commonMain>

in vec2 vUv;
vec3 col;

void main(){
    vec2 texel = 1. / uResolution.xy;
    /*vec2 uv = fragCoord.xy / uResolution.xy;

    vec2 uvTex;
    if (uResolution.x > uResolution.y) {
        uvTex = (fragCoord.xy * 2.0 - uResolution.xy)  / uResolution.x;
    } else {
        uvTex = (fragCoord.xy * 2.0 - uResolution.xy)  / uResolution.y;
    }
    uvTex.x *= 0.7;
    uvTex *= 0.5;
    uvTex += 0.5;*/

    vec3 map = texture(bufferA, vUv).rgb;
    float ld = length(map.rg);


    vec3 norm = normalize(map.rgb)*0.5+0.5;



    //if (uMouse.z > 0.0)
    //fragColor = vec4(norm, 1.0);

}