import React, {Component, Fragment} from 'react';
import {cloth, clothBody, clothGeometry, clothMesh, clothPhysMaterial, simulateCloth, windForce} from "../Utils/Cloth";
import {Detector} from "../Utils/Detector";
import Player from '../Player';
import Purchase from '../Purchase';
import {service} from "../Utils/service";
import {CannonDebugRenderer} from "../Utils/CannonDebugRenderer.js";

import * as CANNON from 'cannon';
import * as THREE from 'three';
import './Release.css';
import debounce from 'lodash/debounce';
import {isMobile} from "../Utils/BrowserDetection";
import {OrbitControls} from "../Utils/OrbitControls";

/* this handles number of segments in cloth , TO DO fix this */
let pinsFormation = [];

let pinsArr = [];
for (let i = 0; i < 51; i++) {
  pinsArr.push(i);
}

service.pins = pinsArr;
pinsFormation.push(service.pins);
service.pins = pinsFormation[0];

// TODO... Someday clean up this shitty hackish code. jk. not really.
// tween.js - http://github.com/sole/tween.js
'use strict';
var TWEEN = TWEEN || function () {
  var a = [];
  return {
    REVISION: "7", getAll: function () {
      return a
    }, removeAll: function () {
      a = []
    }, add: function (c) {
      a.push(c)
    }, remove: function (c) {
      c = a.indexOf(c);
      -1 !== c && a.splice(c, 1)
    }, update: function (c) {
      if (0 === a.length) return !1;
      for (var b = 0, d = a.length, c = void 0 !== c ? c : Date.now(); b < d;) a[b].update(c) ? b++ : (a.splice(b, 1), d--);
      return !0
    }
  }
}();
TWEEN.Tween = function (a) {
  var c = {}, b = {}, d = 1E3, e = 0, f = null, h = TWEEN.Easing.Linear.None, r = TWEEN.Interpolation.Linear, k = [],
    l = null, m = !1, n = null, p = null;
  this.to = function (a, c) {
    null !== c && (d = c);
    b = a;
    return this
  };
  this.start = function (d) {
    TWEEN.add(this);
    m = !1;
    f = void 0 !== d ? d : Date.now();
    f += e;
    for (var g in b) if (null !== a[g]) {
      if (b[g] instanceof Array) {
        if (0 === b[g].length) continue;
        b[g] = [a[g]].concat(b[g])
      }
      c[g] = a[g]
    }
    return this
  };
  this.stop = function () {
    TWEEN.remove(this);
    return this
  };
  this.delay = function (a) {
    e = a;
    return this
  };
  this.easing =
    function (a) {
      h = a;
      return this
    };
  this.interpolation = function (a) {
    r = a;
    return this
  };
  this.chain = function () {
    k = arguments;
    return this
  };
  this.onStart = function (a) {
    l = a;
    return this
  };
  this.onUpdate = function (a) {
    n = a;
    return this
  };
  this.onComplete = function (a) {
    p = a;
    return this
  };
  this.update = function (e) {
    if (e < f) return !0;
    !1 === m && (null !== l && l.call(a), m = !0);
    var g = (e - f) / d, g = 1 < g ? 1 : g, i = h(g), j;
    for (j in c) {
      var s = c[j], q = b[j];
      a[j] = q instanceof Array ? r(q, i) : s + (q - s) * i
    }
    null !== n && n.call(a, i);
    if (1 == g) {
      null !== p && p.call(a);
      g = 0;
      for (i = k.length; g <
      i; g++) k[g].start(e);
      return !1
    }
    return !0
  }
};
TWEEN.Easing = {
  Linear: {
    None: function (a) {
      return a
    }
  }, Quadratic: {
    In: function (a) {
      return a * a
    }, Out: function (a) {
      return a * (2 - a)
    }, InOut: function (a) {
      return 1 > (a *= 2) ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
    }
  }, Cubic: {
    In: function (a) {
      return a * a * a
    }, Out: function (a) {
      return --a * a * a + 1
    }, InOut: function (a) {
      return 1 > (a *= 2) ? 0.5 * a * a * a : 0.5 * ((a -= 2) * a * a + 2)
    }
  }, Quartic: {
    In: function (a) {
      return a * a * a * a
    }, Out: function (a) {
      return 1 - --a * a * a * a
    }, InOut: function (a) {
      return 1 > (a *= 2) ? 0.5 * a * a * a * a : -0.5 * ((a -= 2) * a * a * a - 2)
    }
  }, Quintic: {
    In: function (a) {
      return a * a * a *
        a * a
    }, Out: function (a) {
      return --a * a * a * a * a + 1
    }, InOut: function (a) {
      return 1 > (a *= 2) ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2)
    }
  }, Sinusoidal: {
    In: function (a) {
      return 1 - Math.cos(a * Math.PI / 2)
    }, Out: function (a) {
      return Math.sin(a * Math.PI / 2)
    }, InOut: function (a) {
      return 0.5 * (1 - Math.cos(Math.PI * a))
    }
  }, Exponential: {
    In: function (a) {
      return 0 === a ? 0 : Math.pow(1024, a - 1)
    }, Out: function (a) {
      return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
    }, InOut: function (a) {
      return 0 === a ? 0 : 1 === a ? 1 : 1 > (a *= 2) ? 0.5 * Math.pow(1024, a - 1) : 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
    }
  }, Circular: {
    In: function (a) {
      return 1 -
        Math.sqrt(1 - a * a)
    }, Out: function (a) {
      return Math.sqrt(1 - --a * a)
    }, InOut: function (a) {
      return 1 > (a *= 2) ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    }
  }, Elastic: {
    In: function (a) {
      var c, b = 0.1;
      if (0 === a) return 0;
      if (1 === a) return 1;
      !b || 1 > b ? (b = 1, c = 0.1) : c = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
      return -(b * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / 0.4))
    }, Out: function (a) {
      var c, b = 0.1;
      if (0 === a) return 0;
      if (1 === a) return 1;
      !b || 1 > b ? (b = 1, c = 0.1) : c = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
      return b * Math.pow(2, -10 * a) * Math.sin((a - c) *
        2 * Math.PI / 0.4) + 1
    }, InOut: function (a) {
      var c, b = 0.1;
      if (0 === a) return 0;
      if (1 === a) return 1;
      !b || 1 > b ? (b = 1, c = 0.1) : c = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
      return 1 > (a *= 2) ? -0.5 * b * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / 0.4) : 0.5 * b * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - c) * 2 * Math.PI / 0.4) + 1
    }
  }, Back: {
    In: function (a) {
      return a * a * (2.70158 * a - 1.70158)
    }, Out: function (a) {
      return --a * a * (2.70158 * a + 1.70158) + 1
    }, InOut: function (a) {
      return 1 > (a *= 2) ? 0.5 * a * a * (3.5949095 * a - 2.5949095) : 0.5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
    }
  }, Bounce: {
    In: function (a) {
      return 1 -
        TWEEN.Easing.Bounce.Out(1 - a)
    }, Out: function (a) {
      return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
    }, InOut: function (a) {
      return 0.5 > a ? 0.5 * TWEEN.Easing.Bounce.In(2 * a) : 0.5 * TWEEN.Easing.Bounce.Out(2 * a - 1) + 0.5
    }
  }
};
TWEEN.Interpolation = {
  Linear: function (a, c) {
    var b = a.length - 1, d = b * c, e = Math.floor(d), f = TWEEN.Interpolation.Utils.Linear;
    return 0 > c ? f(a[0], a[1], d) : 1 < c ? f(a[b], a[b - 1], b - d) : f(a[e], a[e + 1 > b ? b : e + 1], d - e)
  }, Bezier: function (a, c) {
    var b = 0, d = a.length - 1, e = Math.pow, f = TWEEN.Interpolation.Utils.Bernstein, h;
    for (h = 0; h <= d; h++) b += e(1 - c, d - h) * e(c, h) * a[h] * f(d, h);
    return b
  }, CatmullRom: function (a, c) {
    var b = a.length - 1, d = b * c, e = Math.floor(d), f = TWEEN.Interpolation.Utils.CatmullRom;
    return a[0] === a[b] ? (0 > c && (e = Math.floor(d = b * (1 + c))), f(a[(e -
      1 + b) % b], a[e], a[(e + 1) % b], a[(e + 2) % b], d - e)) : 0 > c ? a[0] - (f(a[0], a[0], a[1], a[1], -d) - a[0]) : 1 < c ? a[b] - (f(a[b], a[b], a[b - 1], a[b - 1], d - b) - a[b]) : f(a[e ? e - 1 : 0], a[e], a[b < e + 1 ? b : e + 1], a[b < e + 2 ? b : e + 2], d - e)
  }, Utils: {
    Linear: function (a, c, b) {
      return (c - a) * b + a
    }, Bernstein: function (a, c) {
      var b = TWEEN.Interpolation.Utils.Factorial;
      return b(a) / b(c) / b(a - c)
    }, Factorial: function () {
      var a = [1];
      return function (c) {
        var b = 1, d;
        if (a[c]) return a[c];
        for (d = c; 1 < d; d--) b *= d;
        return a[c] = b
      }
    }(), CatmullRom: function (a, c, b, d, e) {
      var a = 0.5 * (b - a), d = 0.5 * (d - c), f =
        e * e;
      return (2 * c - 2 * b + a + d) * e * f + (-3 * c + 3 * b - 2 * a - d) * f + a * e + c
    }
  }
};

class Release0002 extends Component {
  constructor() {
    super();
    //
    this.bpm = 145;
    this.beatTime = (60 / 145) * 1000;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    this.light = new THREE.AmbientLight(0xFFFFFF);

    // net poles
    this.poleGeo = new THREE.BoxGeometry(5, 250 + 125, 5);
    this.poleMat = new THREE.MeshLambertMaterial();
    this.pole1 = new THREE.Mesh(this.poleGeo, this.poleMat);
    this.pole2 = new THREE.Mesh(this.poleGeo, this.poleMat);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.spotLight1 = this.createSpotlight(0xFF7F00);
    this.spotLight2 = this.createSpotlight(0x00FF7F);
    this.spotLight3 = this.createSpotlight(0x7F00FF);

    this.spotLight1.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 1000));
    this.spotLight2.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 1000));
    this.spotLight3.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(60, 1, 1, 1000));

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(9999, 9999);
    this.firstHitMouseHackComplete = false;

    this.hardMaterials = [];

    this.startTime = Date.now();

    this.views = [
      this.getView1,
      this.getView2,
      this.getView6,
      this.getView5,
      this.getView7,
      this.getView4,
      this.getView3,
    ];
  }

  state = {
    renderedOnce: false
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.init();
    this.animate();
  }

  init = () => {
    const {controls} = this;
    this.initCannon();
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    // camera
    this.getView1();
    //camera.maxDistance = 600;
    //camera.lookAt( scene.position );
    // controls
    //controls.maxPolarAngle = Math.PI;
    // controls.minDistance = 10;
    controls.maxDistance = 5000;

    this.addRenderer();
    this.addNet();  // cloth mesh and poles
    this.addLights();
    this.addBulbLights();
    this.addSpotLights();
    this.animateSpotLights();
    this.createRaycasterBody();
    this.createRoom();
    this.createSphere();

    setInterval(() => this.strobeBulbLights(), this.beatTime / 4);

    if (!isMobile) {
      let count = 0;
      setInterval(() => {
        if (count >= this.views.length - 1) {
          count = 0;
        } else {
          count += 1;
        }
        this.views[count]();
      }, this.beatTime * 16);
    }
  }

  onMouseMove = (event) => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  initCannon = () => {
    this.timeStep = 1 / 40;
    this.world = new CANNON.World();
    this.world.gravity.set(0, -1500, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 1;
    this.world.add(clothBody);
    this.hardMaterials.push(clothPhysMaterial);
    this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);
  }

  createSphere = () => {
    this.ballRadius = 60;
    // physics
    let shape = new CANNON.Sphere(this.ballRadius);
    let mass = 1;

    let sphereMaterial = new CANNON.Material();

    this.body = new CANNON.Body({
      mass: mass,
      material: sphereMaterial,
      position: new CANNON.Vec3(0, 0, 0)
    });
    this.body.addShape(shape);
    this.body.linearDamping = 0.01;
    this.body.angularVelocity.set(0, 0, 0);
    this.body.angularDamping = 0.5;
    this.world.addBody(this.body);

    // add surface interaction
    for (let i = 0; i < this.hardMaterials.length; i++) {
      let contactMaterial = new CANNON.ContactMaterial(this.hardMaterials[i], sphereMaterial, {
        friction: 0.0,
        restitution: 10
      });
      this.world.addContactMaterial(contactMaterial);
    }

    // add mouse/sphere interaction
    let mouseBallContactMaterial = new CANNON.ContactMaterial(this.raycasterPhysMaterial, sphereMaterial, {
      friction: 0.0,
      restitution: 10.0
    });
    this.world.addContactMaterial(mouseBallContactMaterial);

    // visual
    let ballGeo = new THREE.SphereBufferGeometry(this.ballRadius, 32, 16);

    let ballMaterial = new THREE.MeshLambertMaterial({
      color: 0xaa2929,
      specular: 0x030303,
      wireframeLinewidth: 10,
      alphaTest: 0.5,
      transparent: true,
      wireframe: true,
    });

    // sphere properties
    this.sphere = new THREE.Mesh(ballGeo, ballMaterial);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;
    this.sphere.visible = true;
    this.sphere.name = "volleyball";

    this.scene.add(this.sphere);
  }

  createAudioSource = () => {
    let source = this.audioCtx.createMediaStreamSource(this.audioStream);
    source.connect(this.audioAnalyser);
    source.connect(this.audioCtx.destination);
  }

  addBulbLights = () => {
    const {scene} = this;

    const sphere = new THREE.SphereBufferGeometry(3, 3, 3);

    const bulbLight1 = new THREE.PointLight(0x363dc2, 10, 2000, 10);
    bulbLight1.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x363dc2,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight1.position.set(-1900, -250, -1950);

    const bulbLight2 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    bulbLight2.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x7F00FF,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight2.position.set(1900, 750, -1950);

    const bulbLight3 = new THREE.PointLight(0x363dc2, 10, 2000, 10);
    bulbLight3.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x363dc2,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight3.position.set(-1900, -250, 1950);

    const bulbLight4 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    bulbLight4.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x7F00FF,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight4.position.set(1900, 750, 1950);

    const bulbLight5 = new THREE.PointLight(0x363dc2, 10, 2000, 10);
    bulbLight5.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x363dc2,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight5.position.set(1900, -250, -1800);

    const bulbLight6 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    bulbLight6.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x7F00FF,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight6.position.set(1900, 750, -1950);

    const bulbLight7 = new THREE.PointLight(0x363dc2, 10, 2000, 10);
    bulbLight7.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x363dc2,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight7.position.set(-1900, -250, 1950);

    const bulbLight8 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    bulbLight8.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x7F00FF,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight8.position.set(-1900, 750, 1950);

    this.bulbLights = [];
    this.bulbLights.push(this.bulbLight1 = bulbLight1);
    this.bulbLights.push(this.bulbLight7 = bulbLight7);
    scene.add(this.bulbLight1);
    scene.add(this.bulbLight7);

    if (this.renderer.capabilities.maxVaryings > 8) {
      this.bulbLights.push(this.bulbLight2 = bulbLight2);
      this.bulbLights.push(this.bulbLight3 = bulbLight3);
      this.bulbLights.push(this.bulbLight4 = bulbLight4);
      this.bulbLights.push(this.bulbLight5 = bulbLight5);
      this.bulbLights.push(this.bulbLight6 = bulbLight6);
      this.bulbLights.push(this.bulbLight8 = bulbLight8);
      scene.add(this.bulbLight2);
      scene.add(this.bulbLight3);
      scene.add(this.bulbLight4);
      scene.add(this.bulbLight5);
      scene.add(this.bulbLight6);
      scene.add(this.bulbLight8);
    }
  }

  createRaycasterBody = () => {
    // physics
    this.raycasterPhysMaterial = new CANNON.Material();
    this.raycasterBody = new CANNON.Body({
      mass: 1000,
      material: this.raycasterPhysMaterial,
      position: CANNON.Vec3(this.mouse.x, this.mouse.y, 99999)
    });
    this.raycasterBody.addShape(new CANNON.Cylinder(10, 10, 100, 10));
    // body.quaternion.setFromAxisAngle(axis, angle);
    this.world.addBody(this.raycasterBody);
    // this.hardMaterials.push(physMaterial);
  }

  createSurface = (position, width, height, axis, angle = 1) => {
    // physics
    let physMaterial = new CANNON.Material({});
    let body = new CANNON.Body({
      mass: 0,
      material: physMaterial,
      position: position
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(width, height, 50)));
    body.quaternion.setFromAxisAngle(axis, angle);
    this.world.addBody(body);
    // visual
    const geometry = new THREE.PlaneGeometry(width, height);
    geometry.faces.forEach(face => face.color = 0x000000);
    const material = new THREE.MeshStandardMaterial({
      emissive: 0x000000,
      emissiveIntensity: 1,
      //side: THREE.DoubleSide,
      // transparent: true,
      // alphaTest: 0.1,
      // opacity: 0.9,
      color: 0x000000
    });
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.flipSided = false;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    this.scene.add(mesh);
    // combine
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    return physMaterial;
  }

  createRoom = () => {

    let roomYPos = -250;
    let roomWidth = 4000;
    let roomHeight = 1000;
    let roomDepth = 4000;

    // TODO there must be a way to use a box, I haven't figured out what to google
    // TODO before sunday: make a for loop or map lol
    let floorPhysPos = new CANNON.Vec3(0, roomYPos, 0);
    let floorAxis = new CANNON.Vec3(1, 0, 0);
    let floorAngle = -Math.PI / 2;
    this.hardMaterials.push(this.createSurface(floorPhysPos, roomDepth, roomWidth, floorAxis, floorAngle));

    let wall1PhysPos = new CANNON.Vec3(0, roomYPos, -roomWidth / 2);
    let wall1Axis = new CANNON.Vec3(0, 0, 0);
    // let wall1Angle = 1; //-Math.PI/2;
    this.hardMaterials.push(this.createSurface(wall1PhysPos, roomWidth, roomDepth + 1000, wall1Axis));
    // BUG: If you make a box the sphere goes flying out past the cube. when you
    // activate all these room objects as planes, this particular body causes the
    // sphere to fly towards and past it into positive z.
    let wall2PhysPos = new CANNON.Vec3(0, roomYPos, roomWidth / 2);
    let wall2Axis = new CANNON.Vec3(1, 0, 0);
    let wall2Angle = Math.PI;
    this.hardMaterials.push(this.createSurface(wall2PhysPos, roomWidth, roomDepth, wall2Axis, wall2Angle));

    let wall3PhysPos = new CANNON.Vec3(roomDepth / 2, roomYPos, 0);
    let wall3Axis = new CANNON.Vec3(0, 1, 0);  // -.5 ?
    let wall3Angle = -Math.PI / 2;
    this.hardMaterials.push(this.createSurface(wall3PhysPos, roomDepth, roomWidth, wall3Axis, wall3Angle));
    //
    let wall4PhysPos = new CANNON.Vec3(-roomDepth / 2, roomYPos, 0);
    let wall4Axis = new CANNON.Vec3(0, 1, 0);  // .5 ?
    let wall4Angle = Math.PI / 2;
    this.hardMaterials.push(this.createSurface(wall4PhysPos, roomDepth, roomWidth, wall4Axis, wall4Angle));

    let ceilingPhysPos = new CANNON.Vec3(0, roomYPos + roomHeight, 0);
    let ceilingAxis = new CANNON.Vec3(1, 0, 0);
    let ceilingAngle = Math.PI / 2;
    this.hardMaterials.push(this.createSurface(ceilingPhysPos, roomDepth, roomWidth, ceilingAxis, ceilingAngle));
  }


  getView1 = () => {
    this.camera.position.x = 900;
    this.camera.rotation.y = Math.sin(0.6);
    this.camera.position.z = 1400;
    this.camera.fov = 80;
    this.isView1 = true;
  }

  getView2 = () => {
    this.camera.position.x = 0;
    this.camera.rotation.y = Math.sin(0.6);
    this.camera.position.z = 200;
    this.camera.position.y = 100;
    this.camera.fov = 100;
    this.isView1 = false;
  }

  getView3 = () => {
    this.camera.position.x = -400,
      this.camera.rotation.y = 0;
    this.camera.position.z = 900;
    this.camera.position.y = -100;
    this.camera.fov = 100;
    this.isView1 = false;
  }

  getView4 = () => {
    this.camera.position.x = 700;
    this.camera.rotation.y = Math.sin(0.6);
    this.camera.position.z = 100;
    this.camera.fov = 60;
    this.isView1 = false;
  }

  getView5 = () => {
    this.camera.position.x = 0;
    this.camera.rotation.x = Math.tan(0.6);
    this.camera.position.z = 500;
    this.camera.fov = 60;
    this.isView1 = false;
  }

  getView6 = () => {
    this.camera.position.x = 0;
    // this.camera.rotation.y = Math.PI / 2;
    this.camera.position.z = 0;
    this.camera.position.y = 200;
    this.camera.lookAt(new THREE.Vector3());
    this.camera.fov = 80;
    this.isView1 = false;
  }

  getView7 = () => {
    this.camera.position.x = 0;
    this.camera.position.z = 0;
    this.camera.position.y = 4500;
    this.camera.lookAt(new THREE.Vector3());
    this.camera.fov = 100;
    this.isView1 = false;
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 1000);

  addLights = () => {
    const {light, scene} = this;
    scene.add(light);
  }

  createSpotlight = (color) => {
    var spotlight = new THREE.SpotLight(color, 2);
    spotlight.castShadow = true;
    spotlight.angle = 0.8;
    spotlight.penumbra = 0.2;
    spotlight.decay = 0;
    spotlight.distance = 300;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    return spotlight;
  }

  addSpotLights = () => {
    const {scene, spotLight1, spotLight2, spotLight3} = this;

    spotLight1.position.set(150, 250, 450);
    spotLight2.position.set(0, 250, 350);
    spotLight3.position.set(-150, 250, 450);

    scene.add(spotLight1, spotLight2, spotLight3);
  }

  tween = (light) => {
    new TWEEN.Tween(light).to({
      angle: (Math.random() * 0.7) + 0.1,
      penumbra: Math.random() + 1
    }, Math.random() * 4000 + 2000)
      .easing(TWEEN.Easing.Quadratic.Out).start();
    new TWEEN.Tween(light.position).to({
      x: (Math.random() * 500) - 250,
      y: (Math.random() * 200) + 100,
      z: (Math.random() * 500) - 250
    }, Math.random() * 4000 + 2000)
      .easing(TWEEN.Easing.Quadratic.Out).start();
  }

  addNet = () => {
    const {pole1, pole2, scene} = this;
    // TODO soft body
    // reference: https://github.com/schteppe/goo-cannon-softbody
    scene.add(clothMesh);

    pole1.position.x = -750;
    pole1.position.z = 0;
    pole1.position.y = -60;
    pole1.receiveShadow = true;
    pole1.castShadow = true;
    scene.add(pole1);

    pole2.position.x = 750;
    pole2.position.z = 0;
    pole2.position.y = -60;
    pole2.receiveShadow = true;
    pole2.castShadow = true;
    scene.add(pole2);
  }

  addRenderer = () => {
    const {renderer} = this;
    // renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderSingleSided = false;
    this.container.appendChild(renderer.domElement);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

  }

  updateCloth = () => {
    var p = cloth.particles;
    for (var i = 0, il = p.length; i < il; i++) {
      clothGeometry.vertices[i].copy(p[i].position);
    }
    clothGeometry.verticesNeedUpdate = true;
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();
  }

  animateSpotLights = () => {
    const {tween, spotLight1, spotLight2, spotLight3} = this;
    tween(spotLight1);
    tween(spotLight2);
    tween(spotLight3);
    setTimeout(this.animateSpotLights, this.beatTime * 4);
  }

  animateBulbLights = (time) => {
    this.bulbLight1.position.x = Math.cos(time * 0.0009) * 1000 + 250;
    this.bulbLight7.position.z = Math.cos(time * 0.0009) * 1000 + 250;
    if (this.renderer.capabilities.maxVaryings > 8) {
      this.bulbLight2.position.x = Math.cos(time * 0.0009) * 1000 + 250;
      this.bulbLight3.position.x = Math.cos(time * 0.0009) * 1000 + 250;
      this.bulbLight4.position.x = Math.cos(time * 0.0009) * 1000 + 250;
      this.bulbLight5.position.z = Math.cos(time * 0.0009) * 1000 + 250;
      this.bulbLight6.position.z = Math.cos(time * 0.0009) * 1000 + 250;
      this.bulbLight8.position.z = Math.cos(time * 0.0009) * 1000 + 250;
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    let time = Date.now();
    this.controls.update(time - this.startTime);

    if (!this.audioElement.paused) {
      if (this.isView1) {
        this.rotateCamera(time);
      }
      this.animateBulbLights(time);
      simulateCloth(time, this.sphere.position, this.body, this.ballRadius, this.sphere);
      this.renderScene();
    } else if (!this.state.renderedOnce) {
      this.renderScene();
      this.setState({renderedOnce: true});
    }
  }

  rotateCamera = (time) => {
    const {camera, scene} = this;

    camera.position.x = Math.cos(time * .0001) * 1400;
    camera.position.z = Math.sin(time * .0001) * 1400;
    camera.lookAt(scene.position);
  }

  updateRaycastIntersects = () => {
    const {camera, scene, raycaster, mouse} = this;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.name === "volleyball") {
        let rayCasterBodyPos = intersects[i].point;
        rayCasterBodyPos.z += 5;
        this.raycasterBody.position.copy(intersects[i].point);
      }
    }
  }


  strobeBulbLights = () => {
    for (let i = 0; i < this.bulbLights.length; i++) {
      this.bulbLights[i].power = Math.random() > 0.5 ? .0001 : 10000.0;
    }
  }

  updatePhysics = () => {
    // Step the physics world
    this.world.step(this.timeStep);
    // Copy coordinates from Cannon.js to Three.js
    this.sphere.position.copy(this.body.position);
    this.sphere.quaternion.copy(this.body.quaternion);
    let maxV = 750;
    let minV = -750;
    // TODO there must be a correct implementation and api access to this common concept
    if (this.body.velocity.x > maxV) {
      this.body.velocity.x = maxV
    }
    if (this.body.velocity.x < minV) {
      this.body.velocity.x = minV
    }
    if (this.body.velocity.y > maxV) {
      this.body.velocity.y = maxV
    }
    if (this.body.velocity.y < minV) {
      this.body.velocity.y = minV
    }
    if (this.body.velocity.z > maxV) {
      this.body.velocity.z = maxV
    }
    if (this.body.velocity.z < minV) {
      this.body.velocity.z = minV
    }
  }

  renderScene = () => {
    const {scene, camera, renderer} = this;
    TWEEN.update();
    this.updateCloth();
    this.updateRaycastIntersects();
    this.updatePhysics();
    // this.cannonDebugRenderer.update();
    renderer.render(scene, camera);
  }

  render() {
    return (
      <Fragment>
        <div className="release">
          <div ref={element => this.container = element}/>
          <Player
            src='assets/0002-yearunknown.mp3'
            type='audio/mpeg'
            message='YEAR UNKNOWN'
            inputRef={el => this.audioElement = el}/>
          <Purchase/>
        </div>
      </Fragment>
    );
  }
}

export default Release0002;
