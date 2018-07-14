import React, { Component } from 'react';
import { render } from 'react-dom';
import { cloth, clothGeometry, clothMesh, simulate, windForce } from "../Utils/Cloth";
import { Detector } from "../Utils/Detector";
import { OrbitControls } from "../Utils/OrbitControls";
import { ballPosition, sphere } from "../Utils/Sphere";
import { service } from "../Utils/service";

import * as THREE from 'three';
import './Release.css';
import debounce from 'lodash/debounce';

/* this handles number of segments in cloth , TO DO fix this */
let pinsFormation = [];

let pinsArr = [];
for (let i=0; i<51; i++) {
  pinsArr.push(i);
}

service.pins = pinsArr;
pinsFormation.push( service.pins );
service.pins = pinsFormation[ 0 ];

// tween.js - http://github.com/sole/tween.js
'use strict';var TWEEN=TWEEN||function(){var a=[];return{REVISION:"7",getAll:function(){return a},removeAll:function(){a=[]},add:function(c){a.push(c)},remove:function(c){c=a.indexOf(c);-1!==c&&a.splice(c,1)},update:function(c){if(0===a.length)return!1;for(var b=0,d=a.length,c=void 0!==c?c:Date.now();b<d;)a[b].update(c)?b++:(a.splice(b,1),d--);return!0}}}();
TWEEN.Tween=function(a){var c={},b={},d=1E3,e=0,f=null,h=TWEEN.Easing.Linear.None,r=TWEEN.Interpolation.Linear,k=[],l=null,m=!1,n=null,p=null;this.to=function(a,c){null!==c&&(d=c);b=a;return this};this.start=function(d){TWEEN.add(this);m=!1;f=void 0!==d?d:Date.now();f+=e;for(var g in b)if(null!==a[g]){if(b[g]instanceof Array){if(0===b[g].length)continue;b[g]=[a[g]].concat(b[g])}c[g]=a[g]}return this};this.stop=function(){TWEEN.remove(this);return this};this.delay=function(a){e=a;return this};this.easing=
function(a){h=a;return this};this.interpolation=function(a){r=a;return this};this.chain=function(){k=arguments;return this};this.onStart=function(a){l=a;return this};this.onUpdate=function(a){n=a;return this};this.onComplete=function(a){p=a;return this};this.update=function(e){if(e<f)return!0;!1===m&&(null!==l&&l.call(a),m=!0);var g=(e-f)/d,g=1<g?1:g,i=h(g),j;for(j in c){var s=c[j],q=b[j];a[j]=q instanceof Array?r(q,i):s+(q-s)*i}null!==n&&n.call(a,i);if(1==g){null!==p&&p.call(a);g=0;for(i=k.length;g<
i;g++)k[g].start(e);return!1}return!0}};
TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return 1>(a*=2)?0.5*a*a:-0.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a:0.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*
a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return 0.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:1>(a*=2)?0.5*Math.pow(1024,a-1):0.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-
Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return 1>(a*=2)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return-(b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4))},Out:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return b*Math.pow(2,-10*a)*Math.sin((a-c)*
2*Math.PI/0.4)+1},InOut:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return 1>(a*=2)?-0.5*b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4):0.5*b*Math.pow(2,-10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4)+1}},Back:{In:function(a){return a*a*(2.70158*a-1.70158)},Out:function(a){return--a*a*(2.70158*a+1.70158)+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*(3.5949095*a-2.5949095):0.5*((a-=2)*a*(3.5949095*a+2.5949095)+2)}},Bounce:{In:function(a){return 1-
TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+0.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+0.9375:7.5625*(a-=2.625/2.75)*a+0.984375},InOut:function(a){return 0.5>a?0.5*TWEEN.Easing.Bounce.In(2*a):0.5*TWEEN.Easing.Bounce.Out(2*a-1)+0.5}}};
TWEEN.Interpolation={Linear:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.Linear;return 0>c?f(a[0],a[1],d):1<c?f(a[b],a[b-1],b-d):f(a[e],a[e+1>b?b:e+1],d-e)},Bezier:function(a,c){var b=0,d=a.length-1,e=Math.pow,f=TWEEN.Interpolation.Utils.Bernstein,h;for(h=0;h<=d;h++)b+=e(1-c,d-h)*e(c,h)*a[h]*f(d,h);return b},CatmullRom:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[b]?(0>c&&(e=Math.floor(d=b*(1+c))),f(a[(e-
1+b)%b],a[e],a[(e+1)%b],a[(e+2)%b],d-e)):0>c?a[0]-(f(a[0],a[0],a[1],a[1],-d)-a[0]):1<c?a[b]-(f(a[b],a[b],a[b-1],a[b-1],d-b)-a[b]):f(a[e?e-1:0],a[e],a[b<e+1?b:e+1],a[b<e+2?b:e+2],d-e)},Utils:{Linear:function(a,c,b){return(c-a)*b+a},Bernstein:function(a,c){var b=TWEEN.Interpolation.Utils.Factorial;return b(a)/b(c)/b(a-c)},Factorial:function(){var a=[1];return function(c){var b=1,d;if(a[c])return a[c];for(d=c;1<d;d--)b*=d;return a[c]=b}}(),CatmullRom:function(a,c,b,d,e){var a=0.5*(b-a),d=0.5*(d-c),f=
e*e;return(2*c-2*b+a+d)*e*f+(-3*c+3*b-2*a-d)*f+a*e+c}}};

class Network extends Component {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x000000);
    this.scene.fog = new THREE.Fog( 0x000000, 500, 10000 );

    this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    this.light = new THREE.AmbientLight( 0x666666 );
    this.ambientLight = new THREE.AmbientLight( 0x666666 );
    this.directionalLight = new THREE.DirectionalLight( 0xdfebff, 1 );

    this.groundMaterial = new THREE.MeshPhongMaterial(
      {
        color: 0x02002f,//0x3c3c3c,
        specular: 0x404761, //0x3c3c3c//,
        //map: groundTexture
      } );
    this.groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), this.groundMaterial );

    // net poles
    this.poleGeo = new THREE.BoxGeometry( 5, 250+125, 5 );
    this.poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100, side: THREE.DoubleSide} );
    this.pole1 = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.pole2 = new THREE.Mesh( this.poleGeo, this.poleMat );

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.createText();
    this.createRoom();
    this.spotLight1 = this.createSpotlight( 0xFF7F00 );
    this.spotLight2 = this.createSpotlight( 0x00FF7F );
    this.spotLight3 = this.createSpotlight( 0x7F00FF );
    this.lightHelper1 = new THREE.SpotLightHelper( this.spotLight1 );
    this.lightHelper2 = new THREE.SpotLightHelper( this.spotLight2 );
    this.lightHelper3 = new THREE.SpotLightHelper( this.spotLight3 );
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.onWindowResize, false );
    this.init();
    this.animate();
  }

  createRoom = () => {
    const {scene} = this;
    const geometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    geometry.faces.forEach( face => face.color.setHex( 0x000000));

    const material = new THREE.MeshNormalMaterial({
      transparent: false,
      receiveShadow: true,
    });
    material.side = THREE.DoubleSide;

    const roomMesh = new THREE.Mesh(geometry, material);
    roomMesh.flipSided = true;
    this.roomMesh = roomMesh;

    scene.add(this.roomMesh);
  }

  createText = () => {
    const fontJson = require("../fonts/helvetiker_bold.typeface.json");
    const font = new THREE.Font(fontJson);
    const textGeo = new THREE.TextGeometry("Network", {
      font: font,
      size: 70,
      height: 10,
      curveSegments: 2,
      bevelEnabled: true,
      weight: 1,
    });
    const textMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    const texMesh = new THREE.Mesh(textGeo, textMaterial);
    texMesh.position.set(200, -245, 0);
    this.scene.add(texMesh);
  }

  tween = ( light ) =>  {
    new TWEEN.Tween( light ).to( {
      angle: ( Math.random() * 0.7 ) + 0.1,
      penumbra: Math.random() + 1
    }, Math.random() * 3000 + 2000 )
    .easing( TWEEN.Easing.Quadratic.Out ).start();
    new TWEEN.Tween( light.position ).to( {
      x: ( Math.random() * 30 ) - 15,
      y: ( Math.random() * 10 ) + 15,
      z: ( Math.random() * 30 ) - 15
    }, Math.random() * 3000 + 2000 )
    .easing( TWEEN.Easing.Quadratic.Out ).start();
  }

  init = () => {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    const { scene, camera, groundMesh, controls } = this;

    // // camera
    camera.position.y = 350;
    camera.position.z = 200;
    camera.lookAt( scene.position );

    // sphere
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    // ground mesh
    groundMesh.position.y = -250;
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh ); // add ground to scene

    // controls
    //controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    this.addRenderer();
    this.addLights();
    this.addNet();  // cloth mesh and poles
    this.addSpotLights();
    this.animateSpotLights();
  }

  onWindowResize = debounce(() => {
    const { camera, renderer } = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }, 1000);

  addLights = () => {
    const {light, ambientLight, directionalLight, scene} = this;
    // lights
    scene.add( light );
    //scene.add( ambientLight );  
    directionalLight.position.set( 0, 200, 100 );
    // directionalLight.position.multiplyScalar( 1.3 );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    let d = 500; // direction
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;
    directionalLight.shadow.camera.far = 2000;
    //scene.add( directionalLight );
  }

  createSpotlight = ( color ) => {
    var newObj = new THREE.SpotLight( color, 2 );
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 450;
    newObj.shadow.mapSize.width = 1024;
    newObj.shadow.mapSize.height = 1024;

    newObj.shadow.camera.near = 500;
    newObj.shadow.camera.far = 4000;
    newObj.shadow.camera.fov = 30;
    return newObj;
  }

  addSpotLights = () => {
    const {scene, spotLight1, spotLight2, spotLight3, lightHelper1, lightHelper2, lightHelper3} = this;
    
    spotLight1.position.set( 150, 250, 450 );
    spotLight2.position.set( 0, 250, 350 );
    spotLight3.position.set( - 150, 250, 450 );
    
    scene.add( spotLight1, spotLight2, spotLight3 );
    scene.add( lightHelper1, lightHelper2, lightHelper3 );
  }

  addNet = () => {
    const { pole1, pole2, scene } = this;

    scene.add( clothMesh );

    pole1.position.x = -750;
    pole1.position.z = 0;
    pole1.position.y = -60;
    pole1.receiveShadow = true;
    pole1.castShadow = true;
    scene.add( pole1 );

    pole2.position.x = 750;
    pole2.position.z = 0;
    pole2.position.y = -60;
    pole2.receiveShadow = true;
    pole2.castShadow = true;
    scene.add( pole2 );
  }

  addRenderer = () => {
    const {renderer} = this;
    // renderer
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.renderSingleSided = false;

    this.container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
  }

  updateCloth = () => {
    var p = cloth.particles;
    for ( var i = 0, il = p.length; i < il; i ++ ) {
      clothGeometry.vertices[ i ].copy( p[ i ].position );
    }
    clothGeometry.verticesNeedUpdate = true;
    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();
  }

  animateSpotLights = () => {
    const {tween, spotLight1, spotLight2, spotLight3} = this;

    tween( spotLight1 );
    tween( spotLight2 );
    tween( spotLight3 );

    setTimeout( this.animateSpotLights, 5000 );

  }

  animate = () => {
    requestAnimationFrame( this.animate );

    let time = Date.now();

    let windStrength = Math.cos( time / 7000 ) * 20 + 40;
    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
    windForce.normalize()
    windForce.multiplyScalar( windStrength );

    simulate( time );
    this.renderScene();
  }

  renderScene = () => {
    const { scene, camera, renderer } = this;
    const { lightHelper1, lightHelper2, lightHelper3 } = this;

    /* LETS ROTATE, WHY NOT */
    // let timer = Date.now() * 0.0002;
    // let cameraRadius = Math.sqrt(camera.position.x*camera.position.x + camera.position.z*camera.position.z);
    // camera.position.x = Math.cos( timer ) * cameraRadius;
    // camera.position.z = Math.sin( timer ) * cameraRadius;
    TWEEN.update();
    if ( lightHelper1 ) lightHelper1.update();
    if ( lightHelper2 ) lightHelper2.update();
    if ( lightHelper3 ) lightHelper3.update();

    this.updateCloth();
    sphere.position.copy( ballPosition );
    renderer.render( scene, camera );
  }

  render() {
    return (
      <div ref={element => this.container = element } />
    );
  }
}

export default Network;
