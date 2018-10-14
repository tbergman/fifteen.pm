import React, {Component, Fragment} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";
import {Reflector} from '../../Utils/Reflector';
import {Water} from '../../Utils/Water2';
import SoundcloudPlayer from '../../SoundcloudPlayer';
import Purchase from '../../Purchase';
import GLTFLoader from "three-gltf-loader";
import {loadGLTF} from "../../Utils/Loaders";
import {assetPath} from "../../Utils/assets";

export const assetPath5 = (p) => {
  return assetPath("5/" + p);
}

let statueDirection = 0.01;

class Release0005 extends Component {
  state = {
    exitingWormhole: false,
    inMirrorLand: true
  }

  componentDidMount() {

    this.init();
    this.time = 0;
    this.clock = new THREE.Clock();


      // When user resize window
    window.addEventListener("resize", this.onResize, false);
    // When user move the mouse
    window.addEventListener('click', this.onClick, false);
    document.body.addEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );

    this.renderScene();
  }

  init = () => {
    // Create an empty scene and define a fog for it
    this.scene = new THREE.Scene();

    // Store the position of the mouse
    // Default is center of the screen
    this.mouse = {
      position: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(0, 0)
    };

    this.mirrorLandCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.mirrorLandCamera.position.set(-16.5, 2.9, 14.7);
    this.mirrorLandCamera.lookAt(this.scene.position);

    this.exitingWormholeCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.exitingWormholeCamera.name = "exitingWormholeCamera";
    this.scene.add(this.exitingWormholeCamera);

    this.createSkyBox();
    this.createMirror();
    this.createLights();
    this.createWater();
    this.createTunnelMesh();
    this.createStatue();

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.mirrorLandCamera, this.renderer.domElement);
    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    const {scene} = this;

    this.cameraLight = new THREE.DirectionalLight(0x666666);
    // light.position.set( 0, 0, 1 );
    this.scene.add(this.cameraLight);

    var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
    mainLight.position.y = 100;
    scene.add(mainLight);

    var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
    greenLight.position.set(550, 50, 0);
    scene.add(greenLight);
    var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    redLight.position.set(-550, 50, 0);
    scene.add(redLight);
    var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
    blueLight.position.set(0, 50, 550);
    scene.add(blueLight);
  }

  createWater() {
    const {scene} = this;
    var params = {
      color: '#ffffff',
      scale: 4,
      flowX: 1,
      flowY: 1
    };
    var waterGeometry = new THREE.PlaneBufferGeometry(50, 50);
    this.water = new Water(waterGeometry, {
      color: params.color,
      scale: params.scale,
      flowDirection: new THREE.Vector2(params.flowX, params.flowY),
      textureWidth: 512,
      textureHeight: 512
    });
    this.water.position.y = .1;
    this.water.rotation.x = Math.PI * -0.5;
    scene.add(this.water);
  }

  createSkyBox() {
    const {scene} = this;
    // sky box
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/releases/5/textures/cube/gradients/');
    var cubeTexture = cubeTextureLoader.load([
      '1.jpg', '2.jpg',
      '3.jpg', '4.jpg',
      '5.jpg', '6.jpg',
    ]);
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeTexture;
    var skyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(new THREE.BoxBufferGeometry(1000, 1000, 1000), skyBoxMaterial);
    scene.add(skyBox);
  }

  createMirror() {
    const mirrorGeometry = new THREE.CircleBufferGeometry(5, 64);
    const mirror = new Reflector(mirrorGeometry, {
      clipBias: 0.3,
      textureWidth: CONSTANTS.ww * window.devicePixelRatio,
      textureHeight: CONSTANTS.wh * window.devicePixelRatio,
      color: 0x000000,
      recursion: 1
    });

    mirror.position.y = 0;
    mirror.rotateY(-Math.PI / 2);

    this.mirror = mirror;
    this.scene.add(this.mirror);
    //
    // var geometry = new THREE.PlaneBufferGeometry(50, 50);
    // var verticalMirror = new Reflector(geometry, {
    //   // clipBias: 0.003,
    //   textureWidth: CONSTANTS.ww * window.devicePixelRatio,
    //   textureHeight: CONSTANTS.wh * window.devicePixelRatio,
    //   color: 0x889999,
    //   recursion: 1
    // });
    // verticalMirror.position.y = 0;
    // verticalMirror.position.z = -50;
    // this.scene.add(verticalMirror);
  }

  createTunnelMesh() {
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.numTubeSegments = 500;
    // complex demo tube
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, -10), new THREE.Vector3(10, 0, -10),
      new THREE.Vector3(20, 0, 0), new THREE.Vector3(30, 0, 10),
      new THREE.Vector3(30, 0, 20), new THREE.Vector3(20, 0, 30),
      new THREE.Vector3(10, 0, 30), new THREE.Vector3(0, 0, 30),
      new THREE.Vector3(-10, 10, 30), new THREE.Vector3(-10, 20, 30),
      new THREE.Vector3(0, 30, 30), new THREE.Vector3(10, 30, 30),
      new THREE.Vector3(20, 30, 15), new THREE.Vector3(10, 30, 10),
      new THREE.Vector3(0, 30, 10), new THREE.Vector3(-10, 20,
        10),
      new THREE.Vector3(-10, 10, 10), new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, -10, 10), new THREE.Vector3(20, -15, 10),
      new THREE.Vector3(30, -15, 10), new THREE.Vector3(40, -15, 10),
      new THREE.Vector3(50, -15, 10), new THREE.Vector3(60, 0, 10),
      new THREE.Vector3(70, 0, 0), new THREE.Vector3(80, 0, 0),
      new THREE.Vector3(90, 0, 0), new THREE.Vector3(100, 0, 0),
      new THREE.Vector3(100, 0, 0), new THREE.Vector3(100, 0, 0)
    ]);

    var geometry = new THREE.Geometry();
    geometry.vertices = this.curve.getPoints(this.numTubeSegments);
    this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    var loader = new THREE.TextureLoader();
    const textures = {
      "galaxy": {
        url: "./assets/releases/5/images/universe.jpg"
      }
    };
    textures.galaxy.texture = loader.load(textures.galaxy.url, function (texture) {
      return texture;
    });
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      map: textures.galaxy.texture
    });

    this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
    this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;

    const radiusSegments = 12
    this.tubeGeometry = new THREE.TubeGeometry(this.curve, this.numTubeSegments, 2, radiusSegments, false);
    this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
    this.scale = 10;
    this.tubeMesh.scale.set(this.scale, this.scale, this.scale);
    // let wireframe = new THREE.Mesh( this.tubeGeometry, this.wireframeMaterial );
    // this.tubeMesh.add( wireframe );
    this.scene.add(this.tubeMesh);

    // original tube geometry
    this.tubeGeometry_o = this.tubeGeometry.clone();
  };

  createStatue = () => {
    this.object = {};
    // define gltf loading manager
    this.manager = new THREE.LoadingManager();
    this.loader = new GLTFLoader(this.manager);
    const statuePath = assetPath5("objects/discus-thrower/scene.gltf");
    const renderStatue = gltfObj => this.renderStatueGltfObj(gltfObj);

    const statueLoadGLTFParams = {
      url: statuePath,
      name: "discus-thrower",
      position: [0, 0, 0],
      rotateX: 0.001,
      rotateY: -0.005,
      rotateZ: 0.01,
      relativeScale: .1,
      loader: this.loader,
      onSuccess: renderStatue,
    }

    loadGLTF({...statueLoadGLTFParams});
  }

  renderStatueGltfObj = (gltfObj) => {
    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/releases/5/objects/discus-thrower/textures/texture1.png/');
    var cubeTexture = cubeTextureLoader.load([
        '6.jpg', '6.jpg',
        '6.jpg', '6.jpg',
        '6.jpg', '6.jpg',
    ]);
    const statueObj = gltfObj.scene.children[0].children[0];
    const updatedStatueMaterial = new THREE.MeshBasicMaterial({
        color: 0xeeeeee,
        envMap: cubeTexture
    });
    statueObj.material = updatedStatueMaterial;
    statueObj.scale.set(.01, .01, .01);
    statueObj.position.set(-2, -4.5, 0);

    this.statueObj = statueObj;
    this.scene.add(statueObj);
    return gltfObj;
  }

  animateStatueAndMirror() {
    const {position} = this.statueObj;
    if (position.y > -0.1) statueDirection = -0.01;
    if (position.y < -4.5) statueDirection = 0.01;
    const newPos = position.y + statueDirection;
    position.setY(newPos);
    const newMirrorXPos = this.mirror.position.x + 0.01;
    this.mirror.rotateY(newMirrorXPos);
  }


  onClick = (e) => {
    if (this.state.exitingWormhole) {
      this.setState({
        exitingWormhole: false,
        inMirrorLand: true
      });
    } else if (this.state.inMirrorLand) {
      this.setState({
        inMirrorLand: true,
        exitingWormhole: false
      });
    }
  }

  onMouseMove = (e) => {
    // Save mouse X & Y position
    this.mouse.target.x = (e.clientX - (CONSTANTS.ww * 0.5)) / (CONSTANTS.ww * 0.5);
    this.mouse.target.y = ((CONSTANTS.wh * 0.5) - e.clientY) / (CONSTANTS.wh * 0.5);
  };

  onResize = () => {
    // On resize, get new width & height of window
    const ww = document.documentElement.clientWidth || document.body.clientWidth;
    const wh = window.innerHeight;

    // Update camera aspect
    this.mirrorLandCamera.aspect = ww / wh;
    // Reset aspect of the camera
    this.mirrorLandCamera.updateProjectionMatrix();
    // Update size of the canvas
    this.renderer.setSize(ww, wh);
  };

  updateMaterialOffset() {
    // Update the offset of the material
    this.tubeMaterial.map.offset.x += this.speed * 0.5;
  };

  updateCurve() {
    var index = 0, vertice_o = null, vertice = null;
    // For each vertice of the tube, move it a bit based on the spline
    for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
      // Get the original tube vertice
      vertice_o = this.tubeGeometry_o.vertices[i];
      // Get the visible tube vertice
      vertice = this.tubeGeometry.vertices[i];
      // Calculate index of the vertice based on the Z axis
      // The tube is made of 50 rings of vertices
      index = Math.floor(i / 50);
      // Update tube vertice
      vertice.x +=
        (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) /
        10;
      vertice.y +=
        (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) /
        5;
    }
    // Warn ThreeJs that the points have changed
    this.tubeGeometry.verticesNeedUpdate = true;

    // Update the points along the curve base on mouse position
    this.curve.points[2].x = -this.mouse.position.x * 0.1;
    this.curve.points[4].x = -this.mouse.position.x * 0.1;
    this.curve.points[2].y = this.mouse.position.y * 0.1;

    // Warn ThreeJs that the spline has changed
    this.splineMesh.geometry.verticesNeedUpdate = true;
    this.splineMesh.geometry.vertices = this.curve.getPoints(70);
  };

  updateCameraPosition() {
    // Update the mouse position with some lerp
    this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
    this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

    // Rotate Z & Y axis
    this.mirrorLandCamera.rotation.z = this.mouse.position.x * 0.2;
    this.mirrorLandCamera.rotation.y = Math.PI - this.mouse.position.x * 0.06;
    // Move a bit the camera horizontally & vertically
    this.mirrorLandCamera.position.x = this.mouse.position.x * 0.015;
    this.mirrorLandCamera.position.y = -this.mouse.position.y * 0.015;
  };

  updateWormholeTravel() {
    this.updateMaterialOffset();

    const {scale, normal, binormal, tubeGeometry, exitingWormholeCamera} = this;
    // animate camera along spline
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;
    // let t = 0;

    var pos = tubeGeometry.parameters.path.getPointAt(t);
    pos.multiplyScalar(scale);
    // interpolation
    var segments = tubeGeometry.tangents.length;

    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;
    if (t > .97) {
      this.setState({
        exitingWormhole: false, // TODO there are two states because at first I was working with three... obviously could do this with one boolean switch
        inMirrorLand: true
      })
    }

    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
    var dir = tubeGeometry.parameters.path.getTangentAt(t);
    var offset = 15;
    normal.copy(binormal).cross(dir);
    // we move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));
    exitingWormholeCamera.position.copy(pos);
    // cameraEye.position.copy( pos );
    // using arclength for stablization in look ahead

    var lookAt = tubeGeometry.parameters.path.getPointAt((t + 10 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(scale);
    // camera orientation 2 - up orientation via normal
    // if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
    exitingWormholeCamera.matrix.lookAt(exitingWormholeCamera.position, lookAt, normal);
    exitingWormholeCamera.rotation.setFromRotationMatrix(exitingWormholeCamera.matrix, exitingWormholeCamera.rotation.order);
  }

  currentCamera = () => {
    if (this.state.exitingWormhole) {
      return this.exitingWormholeCamera;
    } else if (this.state.inMirrorLand) {
      return this.mirrorLandCamera;
    }
  }

  renderScene() {
    let delta = this.clock.getDelta();

    this.time += delta * 0.5;

    let camera = this.currentCamera();
    this.cameraLight.position.copy(camera.position);

    this.state.exitingWormhole && this.updateWormholeTravel();
    this.statueObj && this.animateStatueAndMirror();

    this.renderer.render(this.scene, camera);
    window.requestAnimationFrame(this.renderScene.bind(this));
  }

  render() {
    return (
      <Fragment>
        <div ref={element => this.container = element}/>
        <SoundcloudPlayer
          trackId='514219014'
          secretToken='s-WJVl5'
          message='PLEBEIAN'
          inputRef={el => this.audioElement = el}
          fillColor="white"/>
        <Purchase fillColor="white" href='https://gltd.bandcamp.com/track/lets-beach'/>
      </Fragment>
    );
  }
}

export default Release0005;
