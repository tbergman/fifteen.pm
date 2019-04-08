precision highp float;
precision highp int;

uniform sampler2D iChannel1;
uniform sampler2D iChannel0;
uniform vec2 u_resolution;
uniform float u_time;
// uniform float time;
varying vec2 vUv;

float rand(vec2 n) 
{
    return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float water(vec3 p) 
{
    float t = u_time / 4.;
    p.z += t * 2.;
    p.x += t * 2.;
    vec3 c1 = texture2D(iChannel1, p.xz / 30.).xyz;
    p.z += t * 3.;
    p.x += t * 0.5;
    vec3 c2 = texture2D(iChannel1, p.xz / 30.).xyz;
    p.z += t * 4.;
    p.x += t * 0.8;
    vec3 c3 = texture2D(iChannel1, p.xz / 30.).xyz;
    c1 += c2 - c3;
    float z = (c1.x + c1.y + c1.z) / 3.;
    return p.y + z / 4.;
}
float map(vec3 p) 
{
    float d = 100.0;
    d = water(p);
    return d;
}

float intersect(vec3 ro, vec3 rd) 
{
        float d = 0.0;
    for (int i = 0; i <= 100; i++) 
    {
            float h = map(ro + rd * d);
        if (h < 0.1) return d;
            d += h;
    }
    return 0.0;
}

vec3 norm(vec3 p) 
{
    float eps = .1;
    return normalize(vec3(map(p + vec3(eps, 0, 0)) - map(p + vec3(-eps, 0, 0)), map(p + vec3(0, eps, 0)) - map(p + vec3(0, -eps, 0)), map(p + vec3(0, 0, eps)) - map(p + vec3(0, 0, -eps))));
}

void main() 
{
        // vec2 uv = vUv.xy / resolution.xy - 0.5;
    // uv.x *= resolution.x / resolution.y;
    // vec2 vUvReduced = vUv - 0.5;
    vec2 uv = gl_FragCoord.xy/u_resolution.xy - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    vec3 l1 = normalize(vec3(1, 1, 1));
    vec3 ro = vec3(-3, 7, -5);
    vec3 rc = vec3(0, 0, 0);
    vec3 ww = normalize(rc - ro);
    vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
    vec3 vv = normalize(cross(rc - ro, uu));
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww);
    // vec3 rd = normalize(uu * uv.x + vv * uv.y + ww);
    float d = intersect(ro, rd);
    vec3 c = vec3(0.0);
    if (d > 0.0) 
    {
         vec3 p = ro + rd * d;
        vec3 n = norm(p);
        float spc = pow(max(0.0, dot(reflect(l1, n), rd)), 30.0);
        vec4 ref = texture2D(iChannel0, normalize(reflect(rd, n)).xy);
        vec3 rfa = texture2D(iChannel1, (p + n).xz / 6.0).xyz * (8. / d);
        c = rfa.xyz + (ref.xyz * 0.5) + spc;
    }
        gl_FragColor = vec4(vec3(c), 1.0);
}



// precision mediump float;

// varying vec2 vUv;

// uniform float iTime;
// uniform vec2 resolution;
// uniform sampler2D iChannel0;
// uniform sampler2D iChannel1;

// float rand(vec2 n) { return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453); }

// // ok
// float water(vec3 p) {

// 	float t = iTime;// / 4.;
// 	p.z += t * 2.; p.x += t * 2.;
// 	vec3 c1 = texture2D(iChannel1, p.xz / 30.).xyz;
// 	p.z += t * 3.; p.x += t * 0.5;
// 	vec3 c2 = texture2D(iChannel1, p.xz / 30.).xyz;
// 	p.z += t * 4.; p.x += t * 0.8;
// 	vec3 c3 = texture2D(iChannel1, p.xz / 30.).xyz;
// 	c1 += c2 - c3;
// 	float z = (c1.x + c1.y + c1.z) / 3.;
// 	return p.y + z;// / 4.;
// }

// float map(vec3 p) {
// 	float d = 100.0;
// 	d = water(p);
// 	return d;
// }

// float intersect(vec3 ro, vec3 rd) {
// 	float d = 0.0;
// 	for (int i = 0; i <= 100; i++) {
// 		float h = map(ro + rd * d);
// 		if (h < 0.1) return  d;
// 		d += h;
// 	}
// 	return 0.0;
// }

// vec3 norm(vec3 p) {
// 	float eps = .1;
// 	return normalize(vec3(
// 		map(p + vec3(eps, 0, 0)) - map(p + vec3(-eps, 0, 0)),
// 		map(p + vec3(0, eps, 0)) - map(p + vec3(0, -eps, 0)),
// 		map(p + vec3(0, 0, eps)) - map(p + vec3(0, 0, -eps))
// 	));
// }

// void main(){
//     // vec2 vUvReduced = -1.0 + 2.0 *vUv - 0.5;
//     vec2 vUvReduced = vUv - 0.5;
//     // vUvReduced.x *= resolution.x / resolution.y;
// 	vec3 l1 = normalize(vec3(1, 1, 1));
// 	vec3 ro = vec3(-3, 7, -5);//0, 0, 0);//70, -5);
// 	vec3 rc = vec3(0, 0, 0);
// 	vec3 ww = normalize(rc - ro);
// 	vec3 uu = normalize(cross(vec3(0,1,0), ww));
// 	vec3 vv = normalize(cross(rc - ro, uu));
// 	vec3 rd = normalize(uu * vUvReduced.x + vv * vUvReduced.y + ww);
// 	float d = intersect(ro, rd);
// 	vec3 c = vec3(0.0);
// 	if (d > 0.0) {
// 		vec3 p = ro + rd * d;
// 		vec3 n = norm(p);
// 		float spc = pow(max(0.0, dot(reflect(l1, n), rd)), 30.0);
//         vec4 ref = texture2D(iChannel0, normalize(reflect(rd, n)).xz); // added .xy not sure if correct
//         vec3 rfa = texture2D(iChannel1, (p+n).xz / 6.0).xyz * (8./d);
//         c = rfa.xyz + (ref.xyz * 0.5)+ spc;
// 	}
// 	gl_FragColor = vec4(vec3(c), 1.0 );
// }
