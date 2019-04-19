/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * References:
 *	http://www.valvesoftware.com/publications/2010/siggraph2010_vlachos_waterflow.pdf
 * 	http://graphicsrunner.blogspot.de/2010/08/water-using-flow-maps.html
 *
 */

import * as THREE from 'three';
import { Reflector } from "three-full";
import { Refractor } from "three-full";

/* eslint import/no-webpack-loader-syntax: off */
import water2VertexShader from '!raw-loader!glslify-loader!../Shaders/water2Vertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import water2FragmentShader from '!raw-loader!glslify-loader!../Shaders/water2Fragment.glsl';

export const Water2 = (function () {
  function Water(geometry, options) {

    THREE.Mesh.call(this, geometry);

    this.type = 'Water';

    var scope = this;

    options = options || {};

    var color = (options.color !== undefined) ? new THREE.Color(options.color) : new THREE.Color(0xFFFFFF);
    var textureWidth = options.textureWidth || 512;
    var textureHeight = options.textureHeight || 512;
    var clipBias = options.clipBias || 0;
    var flowDirection = options.flowDirection || new THREE.Vector2(1, 0);
    var flowSpeed = options.flowSpeed || 0.03;
    var reflectivity = options.reflectivity || 0.02;
    var scale = options.scale || 1;
    var shader = options.shader || Water.WaterShader;

    var textureLoader = new THREE.TextureLoader();

    var flowMap = options.flowMap || undefined;
    var normalMap0 = options.normalMap0 || textureLoader.load('assets/shared/images/water/textures/water/Water_1_M_Normal.jpg');
    var normalMap1 = options.normalMap1 || textureLoader.load('assets/shared/images/water/textures/water/Water_2_M_Normal.jpg');

    var cycle = 0.15; // a cycle of a flow map phase
    var halfCycle = cycle * 0.5;
    var textureMatrix = new THREE.Matrix4();
    var clock = new THREE.Clock();

    // internal components

    if (Reflector === undefined) {

      console.error('Water: Required component Reflector not found.');
      return;

    }

    if (Refractor === undefined) {

      console.error('Water: Required component Refractor not found.');
      return;

    }

    var reflector = new Reflector(geometry, {
      textureWidth: textureWidth,
      textureHeight: textureHeight,
      clipBias: clipBias
    });

    var refractor = new Refractor(geometry, {
      textureWidth: textureWidth,
      textureHeight: textureHeight,
      clipBias: clipBias
    });

    reflector.matrixAutoUpdate = false;
    refractor.matrixAutoUpdate = false;

    // material

    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['fog'],
        shader.uniforms
      ]),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      transparent: true,
      fog: true
    });

    if (flowMap !== undefined) {

      this.material.defines.USE_FLOWMAP = '';
      this.material.uniforms.tFlowMap = {
        type: 't',
        value: flowMap
      };

    } else {

      this.material.uniforms.flowDirection = {
        type: 'v2',
        value: flowDirection
      };

    }

    // maps

    normalMap0.wrapS = normalMap0.wrapT = THREE.RepeatWrapping;
    normalMap1.wrapS = normalMap1.wrapT = THREE.RepeatWrapping;

    this.material.uniforms.tReflectionMap.value = reflector.getRenderTarget().texture;
    this.material.uniforms.tRefractionMap.value = refractor.getRenderTarget().texture;
    this.material.uniforms.tNormalMap0.value = normalMap0;
    this.material.uniforms.tNormalMap1.value = normalMap1;

    // water

    this.material.uniforms.color.value = color;
    this.material.uniforms.reflectivity.value = reflectivity;
    this.material.uniforms.textureMatrix.value = textureMatrix;

    // inital values

    this.material.uniforms.config.value.x = 0; // flowMapOffset0
    this.material.uniforms.config.value.y = halfCycle; // flowMapOffset1
    this.material.uniforms.config.value.z = halfCycle; // halfCycle
    this.material.uniforms.config.value.w = scale; // scale

    // functions

    function updateTextureMatrix(camera) {

      textureMatrix.set(
        0.5, 0.0, 0.0, 0.5,
        0.0, 0.5, 0.0, 0.5,
        0.0, 0.0, 0.5, 0.5,
        0.0, 0.0, 0.0, 1.0
      );

      textureMatrix.multiply(camera.projectionMatrix);
      textureMatrix.multiply(camera.matrixWorldInverse);
      textureMatrix.multiply(scope.matrixWorld);

    }

    function updateFlow() {

      var delta = clock.getDelta();
      var config = scope.material.uniforms.config;

      config.value.x += flowSpeed * delta; // flowMapOffset0
      config.value.y = config.value.x + halfCycle; // flowMapOffset1

      // Important: The distance between offsets should be always the value of "halfCycle".
      // Moreover, both offsets should be in the range of [ 0, cycle ].
      // This approach ensures a smooth water flow and avoids "reset" effects.

      if (config.value.x >= cycle) {

        config.value.x = 0;
        config.value.y = halfCycle;

      } else if (config.value.y >= cycle) {

        config.value.y = config.value.y - cycle;

      }

    }

    //

    this.onBeforeRender = function (renderer, scene, camera) {

      updateTextureMatrix(camera);
      updateFlow();

      scope.visible = false;

      reflector.matrixWorld.copy(scope.matrixWorld);
      refractor.matrixWorld.copy(scope.matrixWorld);

      reflector.onBeforeRender(renderer, scene, camera);
      refractor.onBeforeRender(renderer, scene, camera);

      scope.visible = true;

    };

  };

  Water.prototype = Object.create(THREE.Mesh.prototype);
  Water.prototype.constructor = Water;
  Water.WaterShader = {

    uniforms: {

      'color': {
        type: 'c',
        value: null
      },

      'reflectivity': {
        type: 'f',
        value: 0
      },

      'tReflectionMap': {
        type: 't',
        value: null
      },

      'tRefractionMap': {
        type: 't',
        value: null
      },

      'tNormalMap0': {
        type: 't',
        value: null
      },

      'tNormalMap1': {
        type: 't',
        value: null
      },

      'textureMatrix': {
        type: 'm4',
        value: null
      },

      'config': {
        type: 'v4',
        value: new THREE.Vector4()
      }

    },

    vertexShader: water2VertexShader,

    fragmentShader: water2FragmentShader

  };

  return Water;
})();
