import React, {PureComponent, Fragment} from 'react';
import * as THREE from 'three';
import './Releases/Release.css';
import debounce from 'lodash/debounce';
import {FresnelShader} from "./Utils/FresnelShader";
import {loadGLTF} from './Utils/Loaders';

// import nav from './nav.js';

const DEFAULT_RADIUS = 3;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RELEASES = [
  {
    path: "/1",
    name: "YAHCEPH",
    imageURL: "./assets/releases/1/images/home.jpg",
    radius: DEFAULT_RADIUS + Math.random(),
    textURL: "assets/releases/1/objects/text.gltf"
  },
  {
    path: "/2",
    name: "YEAR UNKNOWN",
    imageURL: "./assets/releases/2/images/home.png",
    radius: DEFAULT_RADIUS + Math.random() * 2,
    textURL: "assets/releases/2/objects/text.gltf"
  },
  {
    path: "/3",
    name: "OTHERE",
    imageURL: "./assets/releases/3/images/home.png",
    radius: DEFAULT_RADIUS + Math.random() * 3,
    textURL: "assets/releases/3/objects/text.gltf"
  }
];

class Home extends PureComponent {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF0aFFF);
    this.camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 30;
    this.camera.lookAt(new THREE.Vector3());
    this.releaseObjs = [];
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('click', this.onClick, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('click', this.onClick, false);
    this.container.removeChild(this.renderer.domElement);
  }

  onMouseMove = (event) => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onClick = () => {
    const {raycaster, mouse, camera, scene} = this;
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
      document.body.style.cursor = "pointer";
      let path = intersects[i].object.userData.path;
      // TODO: proper react-router path/nav
      // nav(path);
      window.location = path;
    }
  }

  init = () => {
    this.container.appendChild(this.renderer.domElement);
    this.initReleases();
    this.initRaycaster();
  }

  initReleases = () => {
    for (let i in RELEASES) {
      let releaseMeta = RELEASES[i];
      let mesh = this.initReleaseObj(releaseMeta);
      this.releaseObjs.push({mesh: mesh});
      this.initReleaseText(releaseMeta, mesh.position, i);
    }
  }

  initFresnelShaderMaterial = (urls) => {
    let textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBFormat;
    textureCube.minFilter = THREE.NearestFilter;
    let shader = FresnelShader;
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms["tCube"].value = textureCube;
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });
  }

  initReleaseObj = (meta) => {
    let geometry = new THREE.SphereBufferGeometry(meta.radius, meta.radius * 4, meta.radius * 4);
    geometry.computeBoundingSphere()
    let urls = Array(6).fill("assets/releases/0/images/purple-clouds.jpg");
    console.log(meta.imageURL);
    // let urls = Array(6).fill(meta.imageURL);
    let material = this.initFresnelShaderMaterial(urls);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 - Math.random() * .001;
    mesh.name = meta.name;
    mesh.userData.path = meta.path;
    this.scene.add(mesh);
    return mesh;
  }

  initReleaseText = (meta, pos, i) => {
    // TODO We could do something like this eventually --> https://codepen.io/collection/ABaxyy/#
    let gltfOpts = {
      url: meta.textURL,
      position: [pos.x, pos.y, pos.z],
      relativeScale: 1,
      onSuccess: (obj) => {
        this.releaseObjs[i].text = obj.children[0];
        this.releaseObjs[i].text.material.side = THREE.DoubleSide;
        this.releaseObjs[i].text.rotation.x = Math.random() * .001;
        this.releaseObjs[i].text.rotation.z = Math.random() * .001;
        this.releaseObjs[i].text.userData.polarity = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
        this.releaseObjs[i].text.userData.rotationSpeed = Math.random() * .005;
        let urls = Array(6).fill("assets/releases/0/images/dark-purple-clouds.jpg");
        this.releaseObjs[i].text.material = this.initFresnelShaderMaterial(urls);
        this.scene.add(obj);
      }
    }
    loadGLTF(gltfOpts);
  }

  initRaycaster = () => {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(100, 100);
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 50);

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderCursorStyle = () => {
    const {raycaster, mouse, camera, scene} = this;
    // mouse over
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  }

  renderReleaseLinks = () => {
    let timer = 0.0001 * Date.now();
    for (let i = 0, il = this.releaseObjs.length; i < il; i++) {
      let mesh = this.releaseObjs[i].mesh;
      mesh.position.x = 20 * Math.cos(timer + i);
      mesh.position.y = 10 * Math.sin(timer + i * 1.1);
      let text = this.releaseObjs[i].text;
      if (text !== undefined) { // TODO ensure defined by this point
        text.position.x = mesh.position.x;// + 10;
        text.position.y = mesh.position.y - mesh.geometry.boundingSphere.radius - 2;
        text.position.z = mesh.position.z;
        text.rotation.y += text.userData.rotationSpeed * text.userData.polarity;//rotationIncrement * wobblePolarity;
      }
    }
  }

  renderScene = () => {
    const {renderer, camera, scene} = this;
    this.renderCursorStyle();
    this.renderReleaseLinks();
    renderer.render(scene, camera);
  }


  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element}/>
      </Fragment>
    );
  }
}

export default Home;
