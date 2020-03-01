import * as THREE from "three";

export const TerrainShader = {
  fragmentShaderNoise: `
    uniform float time;
    varying vec2 vUv;
    vec4 permute( vec4 x ) {
      return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );
    }
    vec4 taylorInvSqrt( vec4 r ) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    float snoise( vec3 v ) {
      const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );
      const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );
      // First corner
      vec3 i  = floor( v + dot( v, C.yyy ) );
      vec3 x0 = v - i + dot( i, C.xxx );
      // Other corners
      vec3 g = step( x0.yzx, x0.xyz );
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      // Permutations
      i = mod( i, 289.0 );
      vec4 p = permute( permute( permute(
           i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )
           + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )
           + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );
      // Gradients
      // ( N*N points uniformly over a square, mapped onto an octahedron.)
      float n_ = 1.0 / 7.0; // N=7
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)
      vec4 x_ = floor( j * ns.z );
      vec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs( x ) - abs( y );
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor( b0 ) * 2.0 + 1.0;
      vec4 s1 = floor( b1 ) * 2.0 + 1.0;
      vec4 sh = -step( h, vec4( 0.0 ) );
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3( a0.xy, h.x );
      vec3 p1 = vec3( a0.zw, h.y );
      vec3 p2 = vec3( a1.xy, h.z );
      vec3 p3 = vec3( a1.zw, h.w );
      // Normalise gradients
      vec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) );
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      // Mix final noise value
      vec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 );
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ),
                      dot( p2, x2 ), dot( p3, x3 ) ) );
    }
    float surface3( vec3 coord ) {
      float n = 0.0;
      n += 1.0 * abs( snoise( coord ) );
      n += 0.5 * abs( snoise( coord * 2.0 ) );
      n += 0.25 * abs( snoise( coord * 4.0 ) );
      n += 0.125 * abs( snoise( coord * 8.0 ) );
      return n;
    }
    void main( void ) {
      vec3 coord = vec3( vUv, -time );
      float n = surface3( coord );
      gl_FragColor = vec4( vec3( n, n, n ), 1.0 );
    }
  `,
  vertexShader: `
    varying vec2 vUv;
    uniform vec2 scale;
    uniform vec2 offset;
    void main( void ) {
      vUv = uv * scale + offset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `
};

export const NormalMapShader = {
  uniforms: {
    heightMap: { value: null },
    resolution: { value: new THREE.Vector2(512, 512) },
    scale: { value: new THREE.Vector2(1, 1) },
    height: { value: 0.05 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: `
    uniform float height;
    uniform vec2 resolution;
    uniform sampler2D heightMap;
    varying vec2 vUv;
    void main() {
      float val = texture2D( heightMap, vUv ).x;
      float valU = texture2D( heightMap, vUv + vec2( 1.0 / resolution.x, 0.0 ) ).x;
      float valV = texture2D( heightMap, vUv + vec2( 0.0, 1.0 / resolution.y ) ).x;
      gl_FragColor = vec4( ( 0.5 * normalize( vec3( val - valU, val - valV, height  ) ) + 0.5 ), 1.0 );
    }`
};

export const ShaderTerrain = {

  /* -------------------------------------------------------------------------
  //  Dynamic terrain shader
  //    - Blinn-Phong
  //    - height + normal + diffuse1 + diffuse2 + specular + detail maps
  //    - point, directional and hemisphere lights (use with "lights: true" material option)
  //    - shadow maps receiving
   ------------------------------------------------------------------------- */

  'terrain' : {

    uniforms: THREE.UniformsUtils.merge( [

      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "lights" ],

      {

        "enableDiffuse1": { value: 0 },
        "enableDiffuse2": { value: 0 },
        "enableSpecular": { value: 0 },
        "enableReflection": { value: 0 },

        "tDiffuse1": { value: null },
        "tDiffuse2": { value: null },
        "tDetail": { value: null },
        "tNormal": { value: null },
        "tSpecular": { value: null },
        "tDisplacement": { value: null },

        "uNormalScale": { value: 1.0 },

        "uDisplacementBias": { value: 0.0 },
        "uDisplacementScale": { value: 1.0 },

        "diffuse": { value: new THREE.Color( 0xeeeeee ) },
        "specular": { value: new THREE.Color( 0x111111 ) },
        "shininess": { value: 30 },
        "opacity": { value: 1 },

        "uRepeatBase": { value: new THREE.Vector2( 1, 1 ) },
        "uRepeatOverlay": { value: new THREE.Vector2( 1, 1 ) },

        "uOffset": { value: new THREE.Vector2( 0, 0 ) }

      }

    ] ),

    fragmentShader: [

      "uniform vec3 diffuse;",
      "uniform vec3 specular;",
      "uniform float shininess;",
      "uniform float opacity;",

      "uniform bool enableDiffuse1;",
      "uniform bool enableDiffuse2;",
      "uniform bool enableSpecular;",

      "uniform sampler2D tDiffuse1;",
      "uniform sampler2D tDiffuse2;",
      "uniform sampler2D tDetail;",
      "uniform sampler2D tNormal;",
      "uniform sampler2D tSpecular;",
      "uniform sampler2D tDisplacement;",

      "uniform float uNormalScale;",

      "uniform vec2 uRepeatOverlay;",
      "uniform vec2 uRepeatBase;",

      "uniform vec2 uOffset;",

      "varying vec3 vTangent;",
      "varying vec3 vBinormal;",
      "varying vec3 vNormal;",
      "varying vec2 vUv;",

      "varying vec3 vViewPosition;",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "bsdfs" ],
      THREE.ShaderChunk[ "lights_pars_begin" ],
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],

      "float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {",
        "if ( decayExponent > 0.0 ) {",
          "return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );",
        "}",
        "return 1.0;",
      "}",

      "void main() {",

        "vec3 outgoingLight = vec3( 0.0 );",  // outgoing light does not have an alpha, the surface does
        "vec4 diffuseColor = vec4( diffuse, opacity );",

        "vec3 specularTex = vec3( 1.0 );",

        "vec2 uvOverlay = uRepeatOverlay * vUv + uOffset;",
        "vec2 uvBase = uRepeatBase * vUv;",

        "vec3 normalTex = texture2D( tDetail, uvOverlay ).xyz * 2.0 - 1.0;",
        "normalTex.xy *= uNormalScale;",
        "normalTex = normalize( normalTex );",

        "if( enableDiffuse1 && enableDiffuse2 ) {",

          "vec4 colDiffuse1 = texture2D( tDiffuse1, uvOverlay );",
          "vec4 colDiffuse2 = texture2D( tDiffuse2, uvOverlay );",

          "colDiffuse1 = GammaToLinear( colDiffuse1, float( GAMMA_FACTOR ) );",
          "colDiffuse2 = GammaToLinear( colDiffuse2, float( GAMMA_FACTOR ) );",

          "diffuseColor *= mix ( colDiffuse1, colDiffuse2, 1.0 - texture2D( tDisplacement, uvBase ) );",

        " } else if( enableDiffuse1 ) {",

          "diffuseColor *= texture2D( tDiffuse1, uvOverlay );",

        "} else if( enableDiffuse2 ) {",

          "diffuseColor *= texture2D( tDiffuse2, uvOverlay );",

        "}",

        "if( enableSpecular )",
          "specularTex = texture2D( tSpecular, uvOverlay ).xyz;",

        "mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
        "vec3 finalNormal = tsb * normalTex;",

        "vec3 normal = normalize( finalNormal );",
        "vec3 viewPosition = normalize( vViewPosition );",

        "vec3 totalDiffuseLight = vec3( 0.0 );",
        "vec3 totalSpecularLight = vec3( 0.0 );",

        // point lights

        "#if NUM_POINT_LIGHTS > 0",

          "for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",

            "vec3 lVector = pointLights[ i ].position + vViewPosition.xyz;",

            "float attenuation = calcLightAttenuation( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",

            "lVector = normalize( lVector );",

            "vec3 pointHalfVector = normalize( lVector + viewPosition );",

            "float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
            "float pointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",

            "float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",

            "totalDiffuseLight += attenuation * pointLights[ i ].color * pointDiffuseWeight;",
            "totalSpecularLight += attenuation * pointLights[ i ].color * specular * pointSpecularWeight * pointDiffuseWeight;",

          "}",

        "#endif",

        // directional lights

        "#if NUM_DIR_LIGHTS > 0",

          "vec3 dirDiffuse = vec3( 0.0 );",
          "vec3 dirSpecular = vec3( 0.0 );",

          "for( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {",

            "vec3 dirVector = directionalLights[ i ].direction;",
            "vec3 dirHalfVector = normalize( dirVector + viewPosition );",

            "float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
            "float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

            "float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

            "totalDiffuseLight += directionalLights[ i ].color * dirDiffuseWeight;",
            "totalSpecularLight += directionalLights[ i ].color * specular * dirSpecularWeight * dirDiffuseWeight;",

          "}",

        "#endif",

        // hemisphere lights

        "#if NUM_HEMI_LIGHTS > 0",

          "vec3 hemiDiffuse  = vec3( 0.0 );",
          "vec3 hemiSpecular = vec3( 0.0 );",

          "for( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {",

            "vec3 lVector = hemisphereLightDirection[ i ];",

            // diffuse

            "float dotProduct = dot( normal, lVector );",
            "float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",

            "totalDiffuseLight += mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight );",

            // specular (sky light)

            "float hemiSpecularWeight = 0.0;",

            "vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
            "float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
            "hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );",

            // specular (ground light)

            "vec3 lVectorGround = -lVector;",

            "vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
            "float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
            "hemiSpecularWeight += specularTex.r * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );",

            "totalSpecularLight += specular * mix( hemisphereLights[ i ].groundColor, hemisphereLights[ i ].skyColor, hemiDiffuseWeight ) * hemiSpecularWeight * hemiDiffuseWeight;",

          "}",

        "#endif",

        "outgoingLight += diffuseColor.xyz * ( totalDiffuseLight + ambientLightColor + totalSpecularLight );",

        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",  // TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

        THREE.ShaderChunk[ "fog_fragment" ],

      "}"

    ].join( "\n" ),

    vertexShader: [

      "attribute vec4 tangent;",

      "uniform vec2 uRepeatBase;",

      "uniform sampler2D tNormal;",

      "#ifdef VERTEX_TEXTURES",

        "uniform sampler2D tDisplacement;",
        "uniform float uDisplacementScale;",
        "uniform float uDisplacementBias;",

      "#endif",

      "varying vec3 vTangent;",
      "varying vec3 vBinormal;",
      "varying vec3 vNormal;",
      "varying vec2 vUv;",

      "varying vec3 vViewPosition;",

      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
      THREE.ShaderChunk[ "fog_pars_vertex" ],

      "void main() {",

        "vNormal = normalize( normalMatrix * normal );",

        // tangent and binormal vectors

        "vTangent = normalize( normalMatrix * tangent.xyz );",

        "vBinormal = cross( vNormal, vTangent ) * tangent.w;",
        "vBinormal = normalize( vBinormal );",

        // texture coordinates

        "vUv = uv;",

        "vec2 uvBase = uv * uRepeatBase;",

        // displacement mapping

        "#ifdef VERTEX_TEXTURES",

          "vec3 dv = texture2D( tDisplacement, uvBase ).xyz;",
          "float df = uDisplacementScale * dv.x + uDisplacementBias;",
          "vec3 displacedPosition = normal * df + position;",

          "vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",
          "vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",

        "#else",

          "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
          "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

        "#endif",

        "gl_Position = projectionMatrix * mvPosition;",

        "vViewPosition = -mvPosition.xyz;",

        "vec3 normalTex = texture2D( tNormal, uvBase ).xyz * 2.0 - 1.0;",
        "vNormal = normalMatrix * normalTex;",

        THREE.ShaderChunk[ "shadowmap_vertex" ],
        THREE.ShaderChunk[ "fog_vertex" ],

      "}"

    ].join( "\n" )

  }

};
