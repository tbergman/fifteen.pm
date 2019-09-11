// This is a small chunk that gets pulled into a phong material to make a "TronShader" component.
vec4 diffuseColor = vec4( diffuse, opacity );

float randValFromNormal = cos(rand(vNormal.xy));
float randValFromPixelPos = cos(rand(vUv.xy));

float line1 = plot(vUv.yx, .25); // currently just setting a simple line down the middle...
float line2 = plot(vUv.xy, .50); // currently just setting a simple line down the middle...
float line3 = plot(vUv.xy, .75); // currently just setting a simple line down the middle...
float line4 = plot(vUv.xy, .85); // currently just setting a simple line down the middle...
float line5 = plot(vUv.xy, .90); // currently just setting a simple line down the middle...
float timeVariability = uTime * randValFromNormal;

// TODO right now there are all just slight variations without much forthought about how to make those variations interesting
float streak1 = sin(timeVariability) + cos(randValFromNormal); // creates the motion and gaps
float streak2 = sin(timeVariability) + sin(randValFromNormal); // creates the motion and gaps
float streak3 = cos(timeVariability) + sin(randValFromPixelPos); // creates the motion and gaps
float streak4 = sin(timeVariability) + sin(randValFromPixelPos); // creates the motion and gaps
float streak5 = cos(vUv.x) + sin(randValFromPixelPos); // creates the motion and gaps
vec3 col;
col += line1 * streak1;
col += line2 * streak2;
col += line3 * streak3;
col += line4 * streak4;
col += line5 * streak5;
diffuseColor += vec4(col, 0.);