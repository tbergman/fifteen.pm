varying vec2 vUv;
uniform float uTime;

void main()
{    
    // Normalized pixel coordinates (from 0 to 1)
    // vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(uTime+vUv.xyx+vec3(0,2,4));

    gl_FragColor = vec4( col, 1.0 );
}