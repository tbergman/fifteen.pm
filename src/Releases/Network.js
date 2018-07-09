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
    this.camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x050505 );
    this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    this.ambientLight = new THREE.AmbientLight( 0x666666 );

    this.light = new THREE.DirectionalLight( 0xdfebff, 1 );
    this.loader = new THREE.TextureLoader();


    this.simulate = Cloth.simulate;
    this.clothTexture = this.loader.load( 'assets/circuit_pattern.png' );
    this.clothTexture.anisotropy = 16;

    this.clothMaterial = new THREE.MeshLambertMaterial( {
      map: this.clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    });

    this.clothGeometry = Cloth.clothGeometry;

    this.object = new THREE.Mesh( this.clothGeometry, this.clothMaterial );
    this.object.customDepthMaterial = new THREE.MeshDepthMaterial( {
      depthPacking: THREE.RGBADepthPacking,
      map: this.clothTexture,
      alphaTest: 0.5
    });

    this.sphere = Cloth.sphere;
    this.ballPosition = Cloth.ballPosition;

    this.groundMaterial = new THREE.MeshLambertMaterial( { map: this.groundTexture, color: '#000000' } );
    this.groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), this.groundMaterial );

    this.poleGeo = new THREE.BoxBufferGeometry( 5, 675, 5 );
    this.poleMat = new THREE.MeshLambertMaterial();
    this.poleMesh = new THREE.Mesh( this.poleGeo, this.poleMat );
    this.poleMesh2 = new THREE.Mesh( this.poleGeo, this.poleMat );

    this.poleMatMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), this.poleMat );

    this.gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    this.ggMesh = new THREE.Mesh( this.gg, this.poleMat );
    this.ggMesh2 = new THREE.Mesh( this.gg, this.poleMat );
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.windForce = Cloth.windForce;

    this.mirror = true;
    this.text = "three.js";
    this.hover = 30;
    this.height = 20;
    this.size = 70;
    this.curveSegments = 4;
    this.bevelThickness = 2;
    this.bevelSize = 1.5;
    this.bevelEnabled = true;
    this.font = undefined;

    this.textLoader = new THREE.FontLoader();
    this.loadFont();

    this.materials = [
      new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
      new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];
    this.textMesh1 = new THREE.Mesh( this.textGeo, this.materials );
    this.textMesh2 = new THREE.Mesh( this.textGeo, this.materials );
    this.group = new THREE.Group();
    this.pointLight = new THREE.PointLight( 0xffffff, 1.5 );
  }

  componentDidMount() {
    window.addEventListener( 'resize', this.onWindowResize, false );
    this.init();
    this.animate();
  }

  init = () => {
    const {scene, camera, pointLight, light, ambientLight, object, sphere, groundMesh, poleMesh, poleMesh2, controls, poleMatMesh, ggMesh, ggMesh2, renderer, group} = this;
    const d = 300;

    THREE.Cache.enabled = true;

    camera.position.set( 1000, 50, 1500 );
    scene.add(ambientLight);

    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );

    object.position.set( 0, -250, 0 );
    object.castShadow = true;
    scene.add( object );

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    this.groundTexture = this.loader.load( 'assets/circuit_pattern.png' );
    this.groundTexture.wrapS = this.groundTexture.wrapT = THREE.RepeatWrapping;
    this.groundTexture.repeat.set( 25, 25 );
    this.groundTexture.anisotropy = 16;

    groundMesh.position.y = - 250;
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    poleMesh.position.x = 525;
    poleMesh.position.y = - 62;
    poleMesh.receiveShadow = true;
    poleMesh.castShadow = true;
    scene.add( poleMesh );

    poleMesh2.position.x = - 525;
    poleMesh2.position.y = - 62;
    poleMesh2.receiveShadow = true;
    poleMesh2.castShadow = true;
    scene.add( poleMesh2 );

    poleMatMesh.position.y = - 250 + ( 750 / 2 );
    poleMatMesh.position.x = 0;
    poleMatMesh.receiveShadow = true;
    poleMatMesh.castShadow = true;
    scene.add( poleMatMesh );

    var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh( gg, this.poleMat );
    mesh.position.y = - 250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( gg, this.poleMat );
    mesh.position.y = - 250;
    mesh.position.x = - 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    this.container.appendChild( renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    group.position.y = 100;
    scene.add( group );

    var hash = document.location.hash.substr( 1 );
    if ( hash.length !== 0 ) {
      var colorhash  = hash.substring( 0, 6 );
      var fonthash   = hash.substring( 6, 7 );
      var weighthash = hash.substring( 7, 8 );
      var bevelhash  = hash.substring( 8, 9 );
      var texthash   = hash.substring( 10 );
      this.hex = colorhash;
      this.pointLight.color.setHex( parseInt( colorhash, 16 ) );
      this.fontName = this.reverseFontMap[ parseInt( fonthash ) ];
      this.fontWeight = this.reverseWeightMap[ parseInt( weighthash ) ];
      this.bevelEnabled = parseInt( bevelhash );
      this.text = decodeURI( texthash );
      this.updatePermalink();
    } else {
      this.pointLight.color.setHSL( Math.random(), 1, 0.5 );
      this.hex = this.decimalToHex( this.pointLight.color.getHex() );
    }

    this.addText();

    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );
  }

  onWindowResize = debounce(() => {
    const {camera, renderer} = this;
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  }, 100);


  decimalToHex = ( d ) => {
    var hex = Number( d ).toString( 16 );
    hex = "000000".substr( 0, 6 - hex.length ) + hex;
    return hex.toUpperCase();
  }

  addText = () => {
    var fontMap = {
      "helvetiker": 0,
      "optimer": 1,
      "gentilis": 2,
      "droid/droid_sans": 3,
      "droid/droid_serif": 4
    };
    var weightMap = {
      "regular": 0,
      "bold": 1
    };
    var reverseFontMap = [];
    var reverseWeightMap = [];
    for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
    for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;
  }

  loadFont = () => {
    const fontName = "optimer"; // helvetiker, optimer, gentilis, droid sans, droid serif
    const fontWeight = "bold"; // normal bold

    console.log('assets/fonts/' + fontName + '_' + fontWeight + '.typeface.json');
    this.textLoader.load( 'assets/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
      // this.font = response;
      console.log('font', response);
      this.textGeo = new THREE.TextGeometry( this.text, {
        font: response,
        size: this.size,
        height: this.height,
        curveSegments: this.curveSegments,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelEnabled: this.bevelEnabled
      });
      this.refreshText();
    } );

  }

  refreshText = () => {
    const {textMesh1, textMesh2, text, group, mirror} = this.
    // updatePermalink();
    group.remove( textMesh1 );
    if ( mirror ) group.remove( textMesh2 );
    if ( !text ) return;
    this.createText();
  }

  createText = () => {
    const {textGeo, textMesh1, textMesh2, bevelEnabled, height, size, hover, group, mirror, scene} = this;

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    if ( ! bevelEnabled ) {
      var triangleAreaHeuristics = 0.1 * ( height * size );
      for ( var i = 0; i < textGeo.faces.length; i ++ ) {
        var face = textGeo.faces[ i ];
        if ( face.materialIndex == 1 ) {
          for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
            face.vertexNormals[ j ].z = 0;
            face.vertexNormals[ j ].normalize();
          }
          var va = textGeo.vertices[ face.a ];
          var vb = textGeo.vertices[ face.b ];
          var vc = textGeo.vertices[ face.c ];
          var s = GeometryUtils.triangleArea( va, vb, vc );
          if ( s > triangleAreaHeuristics ) {
            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
              face.vertexNormals[ j ].copy( face.normal );
            }
          }
        }
      }
    }
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textMesh1.position.x = 0;
    textMesh1.position.y = 100;
    textMesh1.position.z = 0;
    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;
    group.add( textMesh1 );
    if ( mirror ) {
      textMesh2.position.x = centerOffset;
      textMesh2.position.y = -hover;
      textMesh2.position.z = height;
      textMesh2.rotation.x = Math.PI;
      textMesh2.rotation.y = Math.PI * 2;
      group.add( textMesh2 );
    }
  }

  updatePermalink = () => {
    var link = this.hex + this.fontMap[this.fontName] + this.weightMap[this.fontWeight] + this.boolToNum(this.bevelEnabled) + "#" + this.encodeURI(this.text);
    this.permalink.href = "#" + link;
    window.location.hash = link;
  }
  animate = () => {

    const {windForce, simulate} = this;
    requestAnimationFrame( this.animate );

    var time = Date.now();

    var windStrength = Math.cos( time / 700 ) * 20 + 40;

    windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
    windForce.normalize()
    windForce.multiplyScalar( windStrength );

    simulate( time );
    this.renderScene();
  }

  renderScene = () => {
    const {clothGeometry, sphere, renderer, ballPosition, scene, camera, group} = this;

    var p = Cloth.cloth.particles;
    for ( var i = 0, il = p.length; i < il; i ++ ) {
      clothGeometry.vertices[ i ].copy( p[ i ].position );
    }

    // clothGeometry.verticesNeedUpdate = true;
    clothGeometry.computeFaceNormals();
    //clothGeometry.computeVertexNormals();

    sphere.position.copy( ballPosition );

    group.rotation.y += ( 90 - group.rotation.y ) * 0.05;

    renderer.render( scene, camera );
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
