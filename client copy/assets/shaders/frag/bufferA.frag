#include <commonMain>




void main()
{
    vec2 uv = fragCoord.xy / uBufferSize.xy;
    vec3 col = texture(bufferA, uv).rgb;




        vec2 mouse = (uMousePosPlane.xy+0.5);

    	vec2 d = fragCoord.xy - mouse.xy*uBufferSize;
        float m = exp(-length(d) / 10.0);
        float scale = clamp(0.0, 1.0, distance(uMovePoint.xy, uMousePosPlane.xy));
        col.rg += (scale * m * d)*0.3;

        /*col.rg += vec2(
            abs(uMovePoint.x-uMousePosPlane.x)-0.5, 
            abs(uMovePoint.y-uMousePosPlane.y)-0.5
        )*(1.0-distance(uv-uMousePosPlane, vec2(0.1)));*/

        vec2 colDir = vec2(
            abs(uMovePoint.x-uMousePosPlane.x)-0.5, 
            abs(uMovePoint.y-uMousePosPlane.y)-0.5
        );

        if (distance(uv, mouse) < 0.2)
        col.rg += colDir*(1.0-distance(uv, mouse)*5.0)*10.0;


        col.rg *= 0.9;



    fragColor = vec4(col, 1.0);
}