import React, { PureComponent, Fragment } from 'react';
import * as THREE from 'three';
import '../Releases/Release.css';
import debounce from 'lodash/debounce';
import GLTFLoader from 'three-gltf-loader';
import { loadGLTF } from '../Utils/Loaders';
import { assetPath } from "../Utils/assets";
import Menu from "../UI/Menu/Menu";
import { OrbitControls } from 'three-full';
import { initRockMaterial } from '../Releases/Release0008_GreemJellyfish/materials.js';
import { Water2 } from "../Utils/Water2"

class HomeDefault extends PureComponent {
  state = {
    overlayOpen: false,
  }

  componentDidMount() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFF0FFF);
    this.camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 3000);
    this.camera.position.set(2.095357312111118, 0.8505415314262585, 11.67921580831209);
    this.camera.rotation.set(-0.042438732895147505, 0.3365395324927288, 0.01402173472318894);
    this.camera.lookAt(new THREE.Vector3());
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', this.onWindowResize, false);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    this.container.removeChild(this.renderer.domElement);
  }
  onWindowResize = debounce(() => {
    const { camera, renderer } = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 50);


  init = () => {
    this.container.appendChild(this.renderer.domElement);
    this.initForest();
    this.initLights();
  }

  initLights = () => {
    const { scene } = this;
    const ambientLight = new THREE.AmbientLight(0xFF0FFF);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
  }

  initForest() {
    const { scene, materials } = this;
    const manager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(manager);
    const textureLoader = new THREE.TextureLoader();
    const rockMaterial = initRockMaterial(textureLoader, 0xFFAFFF);
    rockMaterial.displacementBias = -40;
    const name = "forest";
    // add rocks
    const gltfParams = {
      url: assetPath('8/objects/waterfall/rocks.glb'),
      name: name,
      position: [1, 0, -10],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      relativeScale: 1,
      loader: gltfLoader,
      onSuccess: (gltf) => {
        const { scene, textureLoader } = this;
        const object = gltf.scene.getObjectByProperty('mesh');
        object.traverse(function (node) {
          if (node.name.includes("rock")) {
            node.material = rockMaterial;
            node.material.needsUpdate = false;
          }
        });
        const rocks = gltf.scene;
        scene.add(rocks);
      }
    }
    loadGLTF({ ...gltfParams });
    // add water
    const params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };
    const waterGeometry = new THREE.PlaneBufferGeometry(50, 50);
    const water = new Water2(waterGeometry, {
      color: params.color,
      scale: params.scale,
      flowDirection: new THREE.Vector2(params.flowX, params.flowY),
      textureWidth: 512,
      textureHeight: 512
    });
    water.position.y = .1;
    water.rotation.x = Math.PI * -0.5;
    scene.add(water);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene = () => {
    const { renderer, camera, scene } = this;
    // this.renderCursorStyle();
    // this.renderReleaseLinks();
    renderer.render(scene, camera);
  }

  renderReleaseas() {
    return (<div className="releases-list">
      <ul>
        <li> Releases </li>
        <li><a href="/1">Yahceph</a></li>
        <li><a href="/2">Year Unknown</a></li>
        <li><a href="/3">Othere</a></li>
        <li><a href="/4">Jon Cannon</a></li>
        <li><a href="/5">Plebeian</a></li>
        <li><a href="/6">vveiss</a></li>
        <li><a href="/7">Jon Fay</a></li>
        <li><a href="/8">Greem Jellyfish</a></li>
      </ul>
    </div>);
  }

  render() {
    return (
      <Fragment>
        <Menu
          overlayOpen={false}
          shouldRenderPlayer={false}
        />
        {!this.state.overlayOpen && this.renderReleaseas()}
        <div className="release" ref={element => this.container = element} />
      </Fragment>
    );
  }
}

export default HomeDefault;