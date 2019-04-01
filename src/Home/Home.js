import React, {PureComponent} from 'react';
import * as THREE from "three";


class Home extends PureComponent {
  componentDidMount() {
    var container;
    var camera, scene, renderer;
    var fly;
    var flyPath;
    var flyPathObject;
    var flyRadianPos = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 500);
      camera.position.set(0, 0, 200);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x363dc2);

      // LIGHT
      var dirLight = new THREE.DirectionalLight(0x0000ff, 1.5);
      dirLight.position.set(0, 0, 1).normalize();
      scene.add(dirLight);

      var pointLight = new THREE.PointLight(0x00ff00, 1.5);
      pointLight.position.set(0, 100, -90);
      // pointLight.color.setHSL( Math.random(), 1, 0.5 );
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 1024; // default is 512
      pointLight.shadow.mapSize.height = 1024; // default is 512
      pointLight.decay = 0;
      scene.add(pointLight);

      var ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight)

      // horizon plane
      var geometry = new THREE.BoxGeometry(10000, 10000, 10);
      var material = new THREE.MeshPhongMaterial({color: 0xffffff});
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, -200);
      cube.rotation.x = 90;
      cube.material.lights = true;
      cube.receiveShadow = true;
      scene.add(cube)

      renderer = new THREE.WebGLRenderer();//{alpha:true,  antialias: true});
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      initFly();

    }

    function generateFlyPath() {
      var flyPathVertices = []
      var numFlyPathVertices = 20;
      var numFlyPathPoints = 200;
      var maxX = 250;
      var minX = -250;
      var maxY = 50;
      var minY = 0;
      var maxZ = 350;
      var minZ = -250;
      for (let i = 0; i < numFlyPathVertices; i++) {
        if (i == 0) {
          // if (fly !== undefined && flyPath !== undefined){
          // 	//var end = flyPath.points.length - 1
          // 	console.log("RESET")
          // 	flyPathVertices.push(new THREE.Vector3(maxX, maxY, maxZ))
          // 	//flyPathVertices.push(new THREE.Vector3(flyPath.points[end].x, flyPath.points[end].y, flyPath.points[end].z));
          // } else {
          // ensure fly starts at min
          flyPathVertices.push(new THREE.Vector3(minX, minY, minZ));
          // }
        } else if (i == numFlyPathVertices / 2) {
          // ensure fly paths center
          flyPathVertices.push(new THREE.Vector3(0, 0, 0));
        } else if (i == numFlyPathVertices - 1) {
          // ensure fly loop ends at max
          flyPathVertices.push(new THREE.Vector3(maxX, maxY, maxZ));
        } else {
          var randVect3 = new THREE.Vector3(
            THREE.Math.randInt(minX, maxX),
            THREE.Math.randInt(minY, maxY),
            THREE.Math.randInt(minZ, maxZ)
          );
          flyPathVertices.push(randVect3)
        }
      }
      flyPath = new THREE.CatmullRomCurve3(flyPathVertices);
      var flyPathPoints = flyPath.getPoints(numFlyPathPoints);
      var flyPathGeom = new THREE.BufferGeometry().setFromPoints(flyPathPoints);
      var flyPathMaterial = new THREE.LineBasicMaterial({color: 0x000000, transparent: true});
      flyPathMaterial.opacity = 0;
      if (flyPathObject !== undefined) {
        scene.remove(flyPathObject);
      }
      flyPathObject = new THREE.Line(flyPathGeom, flyPathMaterial);
      scene.add(flyPathObject);
    }

    function initFly() {
      //Create a closed wavey loop
      generateFlyPath()

      // fly sound
      // create an AudioListener and add it to the camera
      var listener = new THREE.AudioListener();
      camera.add(listener);
      // create the PositionalAudio object (passing in the listener)
      var sound = new THREE.PositionalAudio(listener);
      // load a sound and set it as the PositionalAudio object's buffer
      sound.loop = true;
      var audioLoader = new THREE.AudioLoader();
      audioLoader.load('assets/fly.wav', function (buffer) {
        sound.setBuffer(buffer);
        // sound.setLoop( true );
        sound.setRefDistance(20);
        sound.setVolume(.2);
        sound.play();
      });

      // fly
      var flyGeom = new THREE.BoxGeometry(1, 1, 1);
      var flyMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
      fly = new THREE.Mesh(flyGeom, flyMaterial);
      fly.position.set(0, 0, -200);
      fly.rotation.x = 90;
      fly.material.lights = true;
      fly.position.set(flyPath.points[0].x, flyPath.points[0].y, flyPath.points[0].z);
      fly.castShadow = true;
      fly.add(sound);
      scene.add(fly);
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }


    function animate() {
      requestAnimationFrame(animate);
      renderFrame();
    }

    function renderFrame() {
      flyRadianPos += 0.001;
      var pos = flyPath.getPoint(flyRadianPos);
      fly.position.set(pos.x, pos.y, pos.z);
      renderer.render(scene, camera);
    }
  }

  componentWillUnmount() {
    delete this.renderer.domElement;
  }

  render() {
    return (
      <div
        id="home"
      />
    );
  }
}

export default Home;
