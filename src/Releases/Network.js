import React, {Component} from 'react';
import * as THREE from 'three';
import {OrbitControls} from '../Utils/OrbitControls';

import './Release.css';
import debounce from 'lodash/debounce';
import * as Cloth from "../Utils/Cloth";
import {GeometryUtils} from '../Utils/GeometryUtils';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

class Network extends Component {
  shouldComponentUpdate() {
    return false;
  }

  constructor(props, context) {
    super(props, context);

    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(60, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    this.cameraPivot = new THREE.Object3D()
    this.cameraPivotYAxis = new THREE.Vector3( 2, 1, -2 );
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    this.ambientLight = new THREE.AmbientLight(0x666666);

    this.light = new THREE.DirectionalLight(0xdfebff, 1);
    this.loader = new THREE.TextureLoader();


    this.simulate = Cloth.simulate;
    this.clothTexture = this.loader.load('assets/circuit_pattern.png');
    this.clothTexture.anisotropy = 16;

    this.clothMaterial = new THREE.MeshLambertMaterial({
      map: this.clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    });

    this.clothGeometry = Cloth.clothGeometry;

    this.object = new THREE.Mesh(this.clothGeometry, this.clothMaterial);
    this.object.customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: this.clothTexture,
      alphaTest: 0.5
    });

    this.sphere = Cloth.sphere;
    this.ballPosition = Cloth.ballPosition;

    this.groundMaterial = new THREE.MeshLambertMaterial({map: this.groundTexture, color: '#000000'});
    this.groundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), this.groundMaterial);

    this.poleGeo = new THREE.BoxBufferGeometry(5, 675, 5);
    this.poleMat = new THREE.MeshLambertMaterial();
    this.poleMesh = new THREE.Mesh(this.poleGeo, this.poleMat);
    this.poleMesh2 = new THREE.Mesh(this.poleGeo, this.poleMat);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.windForce = Cloth.windForce;

    this.mirror = true;


    this.pointLight = new THREE.PointLight(0xffffff, 1.5);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);


    this.init();
    this.animate();

  }

  init = () => {
    const {scene, camera, pointLight, light, ambientLight, object, sphere, groundMesh, poleMesh, poleMesh2, controls, renderer} = this;
    const d = 300;

    THREE.Cache.enabled = true;
    //camera.rotation.y = 10;
    this.scene.add( this.cameraPivot );
    this.cameraPivot.add( this.camera );
    //camera.position.set(1000, 50, 900);
     this.camera.position.set( 900, 50, 1100 );
    camera.lookAt( this.cameraPivot.position );
    this.cameraPivot.rotateOnAxis( this.cameraPivotYAxis, -.06);

    scene.add(ambientLight);

    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;
    scene.add(light);

    object.position.set(0, -250, 0);
    object.castShadow = true;
    scene.add(object);

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    this.groundTexture = this.loader.load('assets/circuit_pattern.png');
    this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
    this.groundTexture.repeat.set(25, 25);
    this.groundTexture.anisotropy = 16;

    groundMesh.position.y = -300;
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    poleMesh.position.x = 750;
    poleMesh.position.y = -62;
    poleMesh.receiveShadow = true;
    poleMesh.castShadow = true;
    scene.add(poleMesh);

    poleMesh2.position.x = -750;
    poleMesh2.position.y = -62;
    poleMesh2.receiveShadow = true;
    poleMesh2.castShadow = true;
    scene.add(poleMesh2);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    const fontJson = require("../fonts/helvetiker_bold.typeface.json");
    const font = new THREE.Font(fontJson);
    var textGeo = new THREE.TextGeometry("Network", {
      font: font,
      size: 130,
      height: 1,
      curveSegments: 4,
      bevelEnabled: true
    });
    var textMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    var mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(-100, -280, 0);
    this.scene.add(mesh);
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  }, 100);

  animate = () => {

    const {windForce, simulate} = this;
    requestAnimationFrame(this.animate);

    var time = Date.now();

    var windStrength = Math.cos(time / 700) * 20 + 40;

    windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    windForce.normalize()
    windForce.multiplyScalar(windStrength);

    simulate(time);
    this.renderScene();
  }

  renderScene = () => {
    const {clothGeometry, sphere, renderer, ballPosition, scene, camera, group} = this;

    var p = Cloth.cloth.particles;
    for (var i = 0, il = p.length; i < il; i++) {
      clothGeometry.vertices[i].copy(p[i].position);
    }

    // clothGeometry.verticesNeedUpdate = true;
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    sphere.position.copy(ballPosition);
    console.log(this.camera.rotation)
    renderer.render(scene, camera);
  }


  render() {
    return (
      <div
        id="container"
        ref={element => this.container = element}
      ></div>
    );
  }
}

export default Network;
