varying vec2 vUv;
uniform float uTime;
uniform vec3 uPosOffset;
uniform vec3 uCurCenter;

void main()
{    
    // Normalized pixel coordinates (from 0 to 1)
    // vec2 uv = fragCoord/iResolution.xy;
    float numTiles = 5.; // TODO make this a uniform

    // Time varying pixel color
    vec3 col = vec3(0.);
    if (vUv.y > .75){
        col.x =vUv.x + uPosOffset.x - uTime - uCurCenter.x;// * numTiles;// + vUv.x) * numTiles; //0.5 + 0.5*sin(uTime+vUv.xyx);//+uPosOffset);
    }
    // * uPosOffset;

    gl_FragColor = vec4( col, 1.0 );
}