precision mediump float;

varying vec2 vUv;

uniform float u_time;
uniform sampler2D iChannel0;

vec3 rainbow(float h) {
	h = mod(mod(h, 1.0) + 1.0, 1.0);
	float h6 = h * 6.0;
	float r = clamp(h6 - 4.0, 0.0, 1.0) +
		clamp(2.0 - h6, 0.0, 1.0);
	float g = h6 < 2.0
		? clamp(h6, 0.0, 1.0)
		: clamp(4.0 - h6, 0.0, 1.0);
	float b = h6 < 4.0
		? clamp(h6 - 2.0, 0.0, 1.0)
		: clamp(6.0 - h6, 0.0, 1.0);
	return vec3(r, g, b);
}

vec3 plasma(vec2 fragCoord)
{
	const float speed = 12.0;
	
	const float scale = 2.5;
	
	const float startA = 563.0 / 512.0;
	const float startB = 233.0 / 512.0;
	const float startC = 4325.0 / 512.0;
	const float startD = 312556.0 / 512.0;
	
	const float advanceA = 6.34 / 512.0 * 18.2 * speed;
	const float advanceB = 4.98 / 512.0 * 18.2 * speed;
	const float advanceC = 4.46 / 512.0 * 18.2 * speed;
	const float advanceD = 5.72 / 512.0 * 18.2 * speed;
	
	float a = startA + u_time * advanceA;
	float b = startB + u_time * advanceB;
	float c = startC + u_time * advanceC;
	float d = startD + u_time * advanceD;
	
	float n = sin(a + 3.0 * vUv.x) +
		sin(b - 4.0 * vUv.x) +
		sin(c + 2.0 * vUv.y) +
		sin(d + 5.0 * vUv.y);
	
	n = mod(((4.0 + n) / 4.0), 1.0);
	
	return rainbow(n);
}

void main()
{
	vec3 green = vec3(0.173, 0.5, 0.106);
	vec3 foreground = texture2D(iChannel0, vUv).rgb;
	float greenness = 1.0 - (length(foreground - green) / length(vec3(1, 1, 1)));
	float foregroundAlpha = clamp((greenness - 0.8) / 0.1, 0.0, 1.0);
	gl_FragColor = vec4(foreground * (1.0 - foregroundAlpha), 1. - foregroundAlpha);// + vec4(1., 1., 1., 0.0);
}