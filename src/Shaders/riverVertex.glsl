varying vec2 vUv; 
varying vec3 vecPos;
varying vec3 vecNormal;
void main()
{
    vUv = uv;

    // vertex position in camera coords
    vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

    vecNormal = normalMatrix * normal; //(modelViewMatrix * vec4(normal, 0.0)).xyz;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}