import React, {PureComponent, Fragment} from 'react';
import * as THREE from 'three';
import '../../Releases/Release.css';
import debounce from 'lodash/debounce';
import GLTFLoader from 'three-gltf-loader';
import {FresnelShader} from "../../Utils/FresnelShader";
import {loadGLTF} from '../../Utils/Loaders';
import {isMobile} from "../../Utils/BrowserDetection";
import {assetPath} from "../../Utils/assets";

const DEFAULT_RADIUS = 3;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RELEASES = [
  {
    path: "/1",
    name: "YAHCEPH",
    radius: DEFAULT_RADIUS + Math.random(),
    textURL: assetPath("1/objects/text.gltf"),
    soundURL: assetPath("0/sounds/chord-root.wav")
  },
  {
    path: "/2",
    name: "YEAR UNKNOWN",
    radius: DEFAULT_RADIUS + Math.random() * 2,
    textURL: assetPath("2/objects/text.gltf"),
    soundURL: assetPath("0/sounds/chord-fourth.wav")
  },
  {
    path: "/3",
    name: "OTHERE",
    radius: DEFAULT_RADIUS + Math.random() * 3,
    textURL: assetPath("3/objects/text.gltf"),
    soundURL: assetPath("0/sounds/chord-fifth.wav")
  },
  {
    path: "/4",
    name: "JON CANNON",
    radius: DEFAULT_RADIUS + Math.random() * 3,
    textURL: assetPath("4/objects/text.gltf"),
    soundURL: assetPath("0/sounds/chord-octave.wav")
  },
  {
    path: "/5",
    name: "PLEBIAN",
    radius: DEFAULT_RADIUS + Math.random() * 3,
    textURL: assetPath("5/objects/text.gltf"),
    soundURL: assetPath("0/sounds/chord-second.wav")
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
    window.addEventListener("touchstart", this.onMouseMove, false);
    window.addEventListener("touchmove", this.onMouseMove, false);
    this.init();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('click', this.onClick, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener("touchstart", this.onMouseMove, false);
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
      this.initReleaseSound(releaseMeta, mesh);
      this.releaseObjs.push({mesh: mesh});
      this.initReleaseText(releaseMeta, mesh.position, i);
    }
  }

  initReleaseSound = (meta, obj) => {
    const {camera} = this;
    let listener = new THREE.AudioListener();
    camera.add(listener);
    // create the PositionalAudio object (passing in the listener)
    let sound = new THREE.PositionalAudio(listener);
    let audioLoader = new THREE.AudioLoader();
    sound.setVolume(0.25);
    audioLoader.load(meta.soundURL, (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
    });
    obj.add(sound);
    obj.userData.sound = sound; // TODO how to reference sound properly
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
    let urls = Array(6).fill(assetPath("0/images/purple-clouds.jpg"));
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
      loader: new GLTFLoader(),
      onSuccess: (obj) => {
        this.releaseObjs[i].text = obj.scene.children[0];
        this.releaseObjs[i].text.material.side = THREE.DoubleSide;
        this.releaseObjs[i].text.rotation.x = Math.random() * .001;
        this.releaseObjs[i].text.rotation.z = Math.random() * .001;
        this.releaseObjs[i].text.userData.polarity = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
        this.releaseObjs[i].text.userData.rotationSpeed = Math.random() * .005;
        let urls = Array(6).fill(assetPath("0/images/dark-purple-clouds.jpg"));
        this.releaseObjs[i].text.material = this.initFresnelShaderMaterial(urls);
        this.scene.add(obj.scene);
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
    if (intersects.length || isMobile) {
      document.body.style.cursor = "pointer";
      // Play a sound!
      for (let i = 0; i < intersects.length; i++) {
        if (!intersects[i].object.userData.sound.isPlaying) {
          intersects[i].object.userData.sound.play();
        }
      }
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
        text.rotation.y += text.userData.rotationSpeed * text.userData.polarity;
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
