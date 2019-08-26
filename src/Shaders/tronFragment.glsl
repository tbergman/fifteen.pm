varying vec2 vUv;
uniform float uTime;
uniform vec3 uPosOffset;
uniform vec3 uCurCenter;

void main()
{    
    // Time varying pixel color
    vec3 col = vec3(0.);
    // TODO - make this 'wrap' around the screen
    if (vUv.y > .95){
        col.x =sin(vUv.x + uPosOffset.x - uTime - uCurCenter.x);
    }
    gl_FragColor = vec4( col, 1.0 );
}