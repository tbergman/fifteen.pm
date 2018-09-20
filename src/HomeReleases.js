import React, {PureComponent, Fragment} from 'react';
import * as THREE from 'three';
import './Releases/Release.css';
import {BendModifier} from './Utils/BendModifier.js';
import debounce from 'lodash/debounce';

import nav from './nav.js';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const RELEASE_FONT_URL = './assets/fonts/gentilis_bold.typeface.json';
const RELEASES = [
  {
    path: "/1",
    name: "YAHCEPH",
    imageURL: "./assets/releases/1/images/home.png",
    idx: 1, // the order of the releases
    fontURL: RELEASE_FONT_URL
  },
  {
    path: "/2",
    name: "YEAR UNKNOWN",
    imageURL: "./assets/releases/2/images/home.png",
    idx: 2,
    fontURL: RELEASE_FONT_URL
  },
  {
    path: "/3",
    name: "OTHERE",
    imageURL: "./assets/releases/3/images/home.png",
    idx: 3,
    fontURL: RELEASE_FONT_URL
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
    this.modifier = new BendModifier();
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
    console.log(this.props);
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
      let text = this.initReleaseText(mesh.position, releaseMeta)
      this.releaseObjs.push({
        mesh: mesh,
        text: text
      });
    }
  }

  initReleaseObj = (meta) => {
    let radius = 5;
    let geometry = new THREE.SphereBufferGeometry(radius, radius * 4, radius * 4);
    let texture = new THREE.TextureLoader().load(meta.imageURL);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 4;
    let material = new THREE.MeshBasicMaterial({map: texture});
    let mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(meta.start.x, meta.start.y, meta.start.z);
    mesh.position.x = Math.random() * (4 * radius + meta.idx);
    mesh.position.y = Math.random() * (4 * radius + meta.idx);
    mesh.position.z = Math.random() * (4 * radius + meta.idx);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = .5;
    mesh.name = meta.name;
    mesh.userData.path = meta.path;
    this.scene.add(mesh);
    return mesh;
  }

  initReleaseText = (pos, meta) => {
    // TODO We could do something like this --> https://codepen.io/collection/ABaxyy/#
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

  renderScene = () => {
    let timer = 0.0001 * Date.now();
    for (let i = 0, il = this.releaseObjs.length; i < il; i++) {
      let mesh = this.releaseObjs[i].mesh;
      // let text = this.releaseObjs[i].text;
      mesh.position.x = 10 * Math.cos(timer + i);
      mesh.position.y = 10 * Math.sin(timer + i * 1.1);
      // text.position.x = mesh.position.x + 10;
      // text.position.y = mesh.position.y + 10;
    }
    this.renderer.render(this.scene, this.camera);
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
