#include <chank>
#include <commonMain>




void main()
{
    vec2 uv = fragCoord.xy / uBufferSize.xy;
    vec3 col = texture(bufferA, uv).rgb;


        vec2 mouse = (uMousePosPlane.xy+0.5);
        float distMouseMove = distance(uMovePoint.xy, mouse.xy);

    	vec2 d = fragCoord.xy - mouse.xy*uBufferSize;
        float m = exp(-length(d) / 1.0);
        float scale = clamp(0.0, 1.0, distMouseMove*10.0);

    	vec2 d2 = fragCoord.xy - (uMovePoint.xy)*uBufferSize;
        float m2 = exp(-length(d) / 2.0);


        


            col.rg += (vec2(
                surface3(vec3(uv.xy*10.0, 0.0)),
                surface3(vec3(uv.yx*10.0+10.0, 0.0))
            )*2.0-2.0)*0.01;
        

        if (distance(uv, mouse) < 0.07)
        {
            col.rg += ((scale * m * d));
            //col.rg += (scale * m2 * d2);
            col.b = scale*2.0;
            
            vec2 colDir = vec2(
                abs(uMovePoint.x-uMousePosPlane.x)-0.5, 
                abs(uMovePoint.y-uMousePosPlane.y)-0.5
            );

            col.rg += colDir*(1.0-distance(uv, mouse))*10.0*scale;
        } else {
            col.rg *= 0.98;
            col.b *= 0.95;
        }










        //col.rgb = vec3(sin(uTime), cos(uTime), 0.0);



    fragColor = vec4(col, 1.0);
}