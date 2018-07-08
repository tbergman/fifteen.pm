uniform vec2 mousePos;
uniform float mouseSize;
uniform float viscosityConstant;

void main()	{

    vec2 cellSize = 1.0 / resolution.xy;

    vec2 uv = gl_FragCoord.xy * cellSize;

    // heightmapValue.x == height
    // heightmapValue.y == velocity
    // heightmapValue.z, heightmapValue.w not used
    vec4 heightmapValue = texture2D( heightmap, uv );

    // Get neighbours
    vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );
    vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );
    vec4 east = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) );
    vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x, 0.0 ) );

    float sump = north.x + south.x + east.x + west.x - 4.0 * heightmapValue.x;

    float accel = sump * resolution.x * 1.0 / 60.0  * 3.0;

    // Dynamics
    heightmapValue.y += accel;
    heightmapValue.x += heightmapValue.y * 1.0 / 60.0 ;

    // Viscosity
    heightmapValue.x += sump * viscosityConstant;

    // Mouse influence
    float mousePhase = clamp( length( ( uv - vec2( 0.5 ) ) * BOUNDS - vec2( mousePos.x, - mousePos.y ) ) * 3.14 / mouseSize, 0.0, 3.14 );
    heightmapValue.x += cos( mousePhase ) + 1.0;

    gl_FragColor = heightmapValue;
}
