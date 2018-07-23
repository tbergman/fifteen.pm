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
import {isChrome, isFirefox} from "../Utils/BrowserDetection";
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
      this.getView5,
      this.getView4,
      this.getView3,
      this.getView6
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
    this.getView2();
    //camera.maxDistance = 600;
    //camera.lookAt( scene.position );
    // controls
    controls.maxPolarAngle = Math.PI;
    // controls.minDistance = 10;
    controls.maxDistance = 1800;

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

    // let count = 0;
    // setInterval(() => {
    //   if (count >= this.views.length - 1){
    //     count = 0;
    //   } else {
    //     count += 1;
    //   }
    //   this.views[count]();
    // }, this.beatTime * 16);
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
    this.cannonDebugRenderer = new CannonDebugRenderer( this.scene, this.world );
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

    // glossy sphere from: https://medium.com/@soffritti.pierfrancesco/glossy-spheres-in-three-js-bfd2785d4857
    var ballMaterial = new THREE.MeshStandardMaterial({ color: "#ff00ff", roughness: 1, metalness: 1.0 });
    var image = document.createElement('img');
    var envMap = new THREE.Texture(image);
    image.onload = function()  {
        envMap.needsUpdate = true;
    };
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMTc1M2NlNy1iZGRlLTY4NGEtODY1Mi0yZDc0MGJmODNiMjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDI0MzgwNDJCNTU0MTFFNkJGMkNBMDkxMUNCMUMwRjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI0MzgwNDFCNTU0MTFFNkJGMkNBMDkxMUNCMUMwRjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzE3NTNjZTctYmRkZS02ODRhLTg2NTItMmQ3NDBiZjgzYjI2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMxNzUzY2U3LWJkZGUtNjg0YS04NjUyLTJkNzQwYmY4M2IyNiIv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';
    envMap.mapping = THREE.SphericalReflectionMapping;
    ballMaterial.envMap = envMap;

    // // roughnessMap
    // var image = document.createElement('img');
    // var roughnessMap = new THREE.Texture(image);
    // image.onload = function()  {
    //     roughnessMap.needsUpdate = true;
    // };
    // image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzNjk1NjkxQjY0MjExRTY4QTg3RDcxOTNDQkE1RkRGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzNjk1NjkyQjY0MjExRTY4QTg3RDcxOTNDQkE1RkRGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjM2OTU2OEZCNjQyMTFFNjhBODdENzE5M0NCQTVGREYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjM2OTU2OTBCNjQyMTFFNjhBODdENzE5M0NCQTVGREYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5WU2ohAAAAH0lEQVR42mJgoDVg/P//P0kamBgGHRj1w0jxA0CAAQBKrgwBw+YutwAAAABJRU5ErkJggg==';
    // roughnessMap.magFilter = THREE.NearestFilter;
    // ballMaterial.roughnessMap = roughnessMap;

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

    // const bulbLight2 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    // bulbLight2.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
    //   emissive: 0x7F00FF,
    //   emissiveIntensity: 1,
    //   color: 0x000000
    // })));
    // bulbLight2.position.set(1900, 750, -1950);

    const bulbLight3 = new THREE.PointLight(0x363dc2, 10, 2000, 10);
    bulbLight3.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0x363dc2,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight3.position.set(-1900, -250, 1950);

    // const bulbLight4 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    // bulbLight4.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
    //   emissive: 0x7F00FF,
    //   emissiveIntensity: 1,
    //   color: 0x000000
    // })));
    // bulbLight4.position.set(1900, 750, 1950);

    const bulbLight5 = new THREE.PointLight(0xff00ff, 10, 2000, 10);
    bulbLight5.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0xff00ff,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight5.position.set(1900, -250, -1800);

    // const bulbLight6 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    // bulbLight6.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
    //   emissive: 0x7F00FF,
    //   emissiveIntensity: 1,
    //   color: 0x000000
    // })));
    // bulbLight6.position.set(1900, 750, -1950);

    const bulbLight7 = new THREE.PointLight(0xff00ff, 10, 2000, 10);
    bulbLight7.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
      emissive: 0xff00ff,
      emissiveIntensity: 1,
      color: 0x000000
    })));
    bulbLight7.position.set(-1900, -250, 1950);

    // const bulbLight8 = new THREE.PointLight(0x7F00FF, 10, 2000, 10);
    // bulbLight8.add(new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({
    //   emissive: 0x7F00FF,
    //   emissiveIntensity: 1,
    //   color: 0x000000
    // })));
    // bulbLight8.position.set(-1900, 750, 1950);

    this.bulbLights = [];
    this.bulbLights.push(this.bulbLight1 = bulbLight1);
    // this.bulbLights.push(this.bulbLight2 = bulbLight2);
    this.bulbLights.push(this.bulbLight3 = bulbLight3);
    // this.bulbLights.push(this.bulbLight4 = bulbLight4);
    this.bulbLights.push(this.bulbLight5 = bulbLight5);
    // this.bulbLights.push(this.bulbLight6 = bulbLight6);
    this.bulbLights.push(this.bulbLight7 = bulbLight7);
    // this.bulbLights.push(this.bulbLight8 = bulbLight8);

    scene.add(this.bulbLight1);
    // scene.add(this.bulbLight2);
    scene.add(this.bulbLight3);
    // scene.add(this.bulbLight4);
    scene.add(this.bulbLight5);
    // scene.add(this.bulbLight6);
    scene.add(this.bulbLight7);
    // scene.add(this.bulbLight8);

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
    // reference: https://github.com/schteppe/goo-cannon-softbody
    // let physMaterial = new CANNON.Material({});
    // let clothBody = new CANNON.Body({
    //  mass: 0,
    //  material: physMaterial,
    //  position: position
    // });
    // body.addShape(new CANNON.Box( new CANNON.Vec3(width, height, 50)));
    // body.quaternion.setFromAxisAngle(axis, angle);
    // this.world.addBody(body);
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
    // this.bulbLight2.position.x = Math.cos(time * 0.0009) * 1000 + 250;

    this.bulbLight3.position.x = Math.cos(time * 0.0009) * 1000 + 250;
    // this.bulbLight4.position.x = Math.cos(time * 0.0009) * 1000 + 250;

    this.bulbLight5.position.z = Math.cos(time * 0.0009) * 1000 + 250;
    // this.bulbLight6.position.z = Math.cos(time * 0.0009) * 1000 + 250;

    this.bulbLight7.position.z = Math.cos(time * 0.0009) * 1000 + 250;
    // this.bulbLight8.position.z = Math.cos(time * 0.0009) * 1000 + 250;
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
    } else if (!this.state.renderedOnce){
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
      this.bulbLights[i].power = Math.random() > 0.5 ? .0001 : 10000.0 ;
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
        <div ref={element => this.container = element}/>
        <Player
          src='assets/0002-yearunknown.mp3'
          type='audio/mpeg'
          message='YEAR UNKNOWN'
          inputRef={el => this.audioElement = el}/>
        <Purchase/>
      </Fragment>
    );
  }
}

export default Release0002;
