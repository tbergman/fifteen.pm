import React, { PureComponent, Fragment } from 'react';
import * as THREE from 'three';
import '../Releases/Release.css';
import debounce from 'lodash/debounce';
import GLTFLoader from 'three-gltf-loader';
import { FresnelShader } from "three-full";
import { loadGLTF } from '../Utils/Loaders';
import { isMobile } from "../Utils/BrowserDetection";
import { assetPath } from "../Utils/assets";
import Menu from "../UI/Menu/Menu";
import { SOUNDS, NUM_RELEASES } from "./Constants";
import { CONTENT } from "../Content";
import { range } from 'rxjs';

const DEFAULT_RELEASE_MESH_RADIUS = 3;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

// const RELEASES = [
//   {
//     path: "/1",
//     name: "YAHCEPH",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("1/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-root.wav")
//   },
//   {
//     path: "/2",
//     name: "YEAR UNKNOWN",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("2/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-fourth.wav")
//   },
//   {
//     path: "/3",
//     name: "OTHERE",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("3/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-fifth.wav")
//   },
//   {
//     path: "/4",
//     name: "JON CANNON",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("4/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-octave.wav")
//   },
//   {
//     path: "/5",
//     name: "PLEBIAN",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("5/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-second.wav")
//   },
//   {
//     path: "/6",
//     name: "VVEISS",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("6/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-fifth-down.wav")
//   },
//   {
//     path: "/7",
//     name: "JON FAY",
//     radius: DEFAULT_RELEASE_MESH_RADIUS + Math.random(),
//     textURL: assetPath("7/objects/text.gltf"),
//     soundURL: assetPath("0/sounds/chord-third.wav")
//   }
// ];


function pointsOnCircumference(numPoints, radius, center) {
  const points = []
  for (let i = 0; i < numPoints; i++) {
    const x = center.x + radius * Math.cos(2 * Math.PI * i / numPoints);
    const y = center.y + radius * Math.sin(2 * Math.PI * i / numPoints);
    const z = 0;//center.z + radius * Math.tan(2 * Math.PI * i / numPoints);
    points.push({ x: x, y: y, z: z });
  }
  return points
}
const ORBITING_RADIUS = 12;
const CENTER = { x: 0, y: 0 };
const STARTING_POSITIONS = pointsOnCircumference(NUM_RELEASES, ORBITING_RADIUS, CENTER);


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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
    const { raycaster, mouse, camera, scene } = this;
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
    let centerPivot = new THREE.Object3D();
    this.scene.add(centerPivot);
    for (let idx = 0; idx < NUM_RELEASES; idx++) {
      const key = "/" + (idx + 1);
      let releaseMeta = CONTENT[key];
      let orbMesh = this.initReleaseOrb(key, releaseMeta, idx);
      let meshPivot = new THREE.Object3D();
      centerPivot.add(meshPivot);
      meshPivot.add(orbMesh);
      this.releaseObjs.push({
        orb: orbMesh,
        pivot: meshPivot
      })
      this.initReleaseSound(idx, orbMesh);
      // this.initReleaseText(releaseMeta, orbMesh.position, idx);
    }
  }

  initReleaseSound = (idx, obj) => {
    const { camera } = this;
    let listener = new THREE.AudioListener();
    camera.add(listener);
    // create the PositionalAudio object (passing in the listener)
    let sound = new THREE.PositionalAudio(listener);
    let audioLoader = new THREE.AudioLoader();
    sound.setVolume(0.25);
    audioLoader.load(SOUNDS[idx], (buffer) => {
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

  initReleaseOrb = (key, meta, idx) => {
    const radius = DEFAULT_RELEASE_MESH_RADIUS + Math.random();
    let geometry = new THREE.SphereBufferGeometry(radius, radius * 4, radius * 4);
    geometry.computeBoundingSphere()
    let urls = Array(6).fill(assetPath("0/images/purple-clouds.jpg"));
    let material = this.initFresnelShaderMaterial(urls);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 - Math.random() * .001;
    mesh.material.opacity = .1;
    mesh.name = meta.artist;
    mesh.userData.path = key;
    const pos = STARTING_POSITIONS[idx];
    mesh.position.x = pos.x;
    mesh.position.y = pos.y;
    mesh.position.z = pos.z;
    this.scene.add(mesh);
    return mesh;
  }

  initReleaseText = (meta, mesh, idx) => {
    // TODO We could do something like this eventually --> https://codepen.io/collection/ABaxyy/#
    let gltfOpts = {
      url: meta.textModel,
      position: STARTING_POSITIONS[idx],
      relativeScale: 1,
      loader: new GLTFLoader(),
      onSuccess: (gltf) => {
        let text = gltf.scene.getObjectByName("ArtistText");
        text.rotation.x = Math.random() * .001;
        text.rotation.z = Math.random() * .001;
        text.userData.polarity = THREE.Math.randInt(-1, 1) > 0 ? 1 : -1;
        text.userData.rotationSpeed = Math.random() * .005;
        let urls = Array(6).fill(assetPath("0/images/dark-purple-clouds.jpg"));
        text.material.side = THREE.DoubleSide;
        text.material = this.initFresnelShaderMaterial(urls);
        mesh.text = text;
        this.releaseObjs[idx].text = mesh;
        this.scene.add(gltf.scene);
      }
    }
    loadGLTF(gltfOpts);
  }


  initRaycaster = () => {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(100, 100);
  }

  onWindowResize = debounce(() => {
    const { camera, renderer } = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 50);

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderCursorStyle = () => {
    const { raycaster, mouse, camera, scene } = this;
    // mouse over
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length || isMobile) {
      document.body.style.cursor = "pointer";
      // Play a sound!
      for (let i = 0; i < intersects.length; i++) {
        console.log("INTERSECT", intersects[i]);
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
    for (let i = 0; i < this.releaseObjs.length; i++) {
      let orbMesh = this.releaseObjs[i].orb;
      let orbPivot = this.releaseObjs[i].pivot;
      orbPivot.rotation.x += .001;
      orbPivot.rotation.y += .003;
      orbPivot.rotation.z += .003;
      let textMesh = this.releaseObjs[i].text;
      if (textMesh !== undefined) {
        textMesh.position.x = orbMesh.position.x;
        textMesh.position.y = orbMesh.position.y - mesh.geometry.boundingSphere.radius - 2;
        textMesh.position.z = orbMesh.position.z;
        textMesh.rotation.y += textMesh.userData.rotationSpeed * textMesh.userData.polarity;
      }
    }
  }

  renderScene = () => {
    const { renderer, camera, scene } = this;
    this.renderCursorStyle();
    this.renderReleaseLinks();
    renderer.render(scene, camera);
  }


  render() {
    return (
      <Fragment>
        <Menu
          overlayOpen={false}
          renderPlayer={false}
        />
        <div className="release" ref={element => this.container = element} />
      </Fragment>
    );
  }
}

export default Home;
