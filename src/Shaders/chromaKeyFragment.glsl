precision mediump float;

// Borrowed from: https://www.shadertoy.com/view/Mdf3zS and https://www.shadertoy.com/view/Xss3DN
varying vec2 vUv;

uniform bool uAddDots;
uniform vec2 uResolution;
uniform sampler2D iChannel0;

// Size of the dot quad in pixels
const float size = 7.0;

// Radius of the dots
const float radius = size * 0.5 * 0.75;

vec4 addDots(vec4 color){
	// Current quad in pixels
	vec2 quadPos = floor(gl_FragCoord.xy / size) * size;
	// Normalized quad position
	vec2 quad = quadPos/uResolution.xy;
	// Center of the quad
	vec2 quadCenter = (quadPos + size/2.0);
	// Distance to quad center	
	float dist = length(quadCenter - gl_FragCoord.xy);
	if (dist > radius)
	{
		return vec4(color.rgb, 0.);
	}
	else
	{
		return color;
	}
}	

void main()
{
	vec3 green = vec3(0.173, 0.5, 0.106);
	vec3 foreground = texture2D(iChannel0, vUv).rgb;
	float greenness = 1.0 - (length(foreground - green) / length(vec3(1, 1, 1)));
	float foregroundAlpha = clamp((greenness - 0.8) / 0.1, 0.0, 1.0);
	vec4 color = vec4(foreground * (1.0 - foregroundAlpha), 1. - foregroundAlpha);// + vec4(1., 1., 1., 0.0);
	if (uAddDots){
		color = addDots(color);
	}	
	gl_FragColor = color;
}