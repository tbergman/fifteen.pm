import React, { Suspense, useRef } from 'react';
import { useThree, extend, useFrame } from 'react-three-fiber';
import "../../UI/Player/Player.css";
import "../Room.css";
import { MaterialsProvider } from './MaterialsContext';
import Stars from '../../Utils/Stars';
import Hall from './Hall';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

const Controls = props => {
  const { camera, gl } = useThree()
  const controls = useRef()
  useFrame(() => controls.current && controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} {...props} />
}

export default function Scene({ content, ...props }) {

  return (<>
    <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
    <ambientLight />
    <MaterialsProvider>
      <Stars radius={2} colors={[0xffffff, 0xfffff0, 0xf9f1f1]} />
      <Suspense fallback={null}>
        <Hall />
      </Suspense>
    </MaterialsProvider>
  </>)
}



// export default class Scene extends Component {

//   componentDidMount() {
//     this.init();
//     window.addEventListener("touchmove", this.onTouchMove, false);
//     window.addEventListener("resize", this.onWindowResize, false);
//     this.animate();
//   }

//   componentWillUnmount() {
//     this.stop();
//     window.removeEventListener("resize", this.onWindowResize, false);
//     window.removeEventListener("touchmove", this.onTouchMove, false);
//   }

//   componentDidUpdate = (prevProps, prevState) => {
//     const { section } = this.state;
//   };

//   onTouchMove(e) {
//     if (e.scale !== 1) {
//       event.preventDefault();
//     }
//   }

//   stop = () => {
//     cancelAnimationFrame(this.frameId);
//   };


//   onWindowResize = debounce(() => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     this.rendererCSS.setSize(width, height);
//     this.camera.aspect = width / height;
//     this.camera.updateProjectionMatrix();
//   }, 50);

//   init() {
//     // this.scene.background = new THREE.Color(0xFF0FFF);
//     this.content = this.props.content.content;

//     // main initialization parameters
//     this.SCREEN_WIDTH = window.innerWidth;
//     this.SCREEN_HEIGHT = window.innerHeight;
//     var VIEW_ANGLE = 45, ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT, NEAR = 1, FAR = 5000;
//     this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
//     this.camera.position.set( 0, -500, 100 );
//     // this.initCSSContext();
//     this.initGLContext();
//     // this.initLivestream();
//     this.initFloor();
//     this.initControls();

//   }

//   initGLContext = () => {
//     // Setup CSS Rendering
//     this.sceneGL = new THREE.Scene();
//     this.rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     this.rendererGL.setPixelRatio(window.devicePixelRatio);
//     this.rendererGL.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
//     this.container.appendChild(this.rendererGL.domElement);
//   }

//   initCSSContext = () => {
//     // Setup CSS Rendering
//     this.sceneCSS = new THREE.Scene();
//     this.rendererCSS	= new CSS3DRenderer(this.SCREEN_WIDTH, this.SCREEN_HEIGHT );
//     this.rendererCSS.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );
//     this.rendererCSS.domElement.style.position	= 'absolute';
//     this.rendererCSS.domElement.style.top	= 0;
//     this.rendererCSS.domElement.style.margin	= 0;
//     this.rendererCSS.domElement.style.padding	= 0;
//     this.container.appendChild(this.rendererCSS.domElement);
//   }

//   initLivestream = () => {
//     // Live stream
//     this.iframe	= document.createElement('iframe')
//     this.iframe.style.width = '1080px';
//     this.iframe.style.height = '720px';
//     this.iframe.style.backgroundColor = '#ffffff';

//     this.iframe.src = [ 'https://www.youtube.com/embed/', this.content.liveStreamVideoId, '?controls=0&disablekb=1&iv_load_policy=3&fs=0&modestbranding=1&showinfo=0&cc_load_policy=0&autoplay=1&origin=https://', window.location.hostname ].join( '' );
//     this.iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//     this.iframe3D = new CSS3DObject( this.iframe );
//     this.iframe3D.position.set(0, 1000,  0);
//     this.iframe3D.rotation.x = Math.PI / 2;
//     this.sceneCSS.add(this.iframe3D);
//     this.camera.lookAt(this.iframe3D);
//   }

//   initFloor() {
//     // FLOOR
//     this.floorTexture = new THREE.ImageUtils.loadTexture(assetPathClub('images/checkerboard.jpg'));
//     this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping; 
//     this.floorTexture.repeat.set( 10, 10 );
//     this.floorMaterial = new THREE.MeshBasicMaterial( { map: this.floorTexture, side: THREE.DoubleSide } );
//     this.floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
//     this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
//     this.floor.position.set(0, 200, 0);
//     this.floor.rotation.z = -Math.PI / 2;
//     this.sceneGL.add(this.floor);
//   }

//   initLights() {
//     var directionalLight = new THREE.DirectionalLight(0xffffff);
//     directionalLight.position.set(1, 1, 1).normalize();
//     this.sceneGL.add(directionalLight);
//     var pointLight = new THREE.PointLight(0xffffff);
//     this.pointLight = pointLight;
//     this.sceneGL.add(this.pointLight);
//   }

//   initControls = () => {
//     this.controls = new OrbitControls( this.camera, this.container );
//   }

//   updateLights() {
//     const { clock, pointLight } = this;
//     pointLight.userData.angle -= 0.025;
//     let lightIntensity =
//       0.75 + 0.25 * Math.cos(clock.getElapsedTime() * Math.PI);
//     pointLight.position.x = 10 + 10 * Math.sin(pointLight.userData.angle);
//     pointLight.position.y = 10 + 10 * Math.cos(pointLight.userData.angle);
//     pointLight.color.setHSL(lightIntensity, 1.0, 0.5);
//     return lightIntensity;
//   }

//   animate = () => {
//     requestAnimationFrame( this.animate );
//     this.renderScene();
//   };

//   renderScene = () => {
//     this.controls.update();
//     this.rendererGL.render(this.sceneGL, this.camera);
//     // this.rendererCSS.render(this.sceneCSS, this.camera);
//   };

//   render() {
//     return (
//       <div className="release">
//         <div ref={element => (this.container = element)} />
//       </div>

//     );
//   }
// }
