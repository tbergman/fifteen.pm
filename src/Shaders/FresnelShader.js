/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Based on Nvidia Cg tutorial
 * 
 * (Shaders extracted by globally.ltd)
 */

/* eslint import/no-webpack-loader-syntax: off */
import fresnelVertexShader from '!raw-loader!glslify-loader!../Shaders/fresnelVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import fresnelFragmentShader from '!raw-loader!glslify-loader!../Shaders/fresnelFragment.glsl';


export const FresnelShader = {
  uniforms: {
    "mRefractionRatio": { value: 1.02 },
    "mFresnelBias": { value: 0.1 },
    "mFresnelPower": { value: 2.0 },
    "mFresnelScale": { value: 1.0 },
    "tCube": { value: null }

  },
  vertexShader: fresnelVertexShader,
  fragmentShader: fresnelFragmentShader
};
