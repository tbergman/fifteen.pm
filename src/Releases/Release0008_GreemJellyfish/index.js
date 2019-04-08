import React, { PureComponent, Fragment } from 'react';
import * as THREE from "three";
import { RenderPass, ShaderPass, CopyShader, EffectComposer, ThreeMFLoader } from "three-full";
import debounce from 'lodash/debounce';
import { assetPath } from "../../Utils/assets";
import AudioStreamer from "../../Utils/Audio/AudioStreamer";
import { loadVideo, loadImage } from "../../Utils/Loaders";

/* eslint import/no-webpack-loader-syntax: off */
import chromaVertexShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import chromaFragmentShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyFragment.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverVertexShader from '!raw-loader!glslify-loader!../../Shaders/riverVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverFragmentShader from '!raw-loader!glslify-loader!../../Shaders/riverFragment.glsl';
    
    
const assetPath8 = (p) => {
    return assetPath("8/" + p);
};

const assetPath8Videos = (p) => {
    return assetPath8("videos/" + p);
};

const multiSourceVideo = (path) => ([
    { type: 'video/mp4', src: assetPath8Videos(`${path}.mp4`) },
    { type: 'video/webm', src: assetPath8Videos(`${path}.webm`) }
]);

class Release0008_GreemJellyFish extends PureComponent {
    componentDidMount() {
      this.init();
      window.addEventListener('mousemove', this.onDocumentMouseMove, false);
      window.addEventListener("touchstart", this.onDocumentMouseMove, false);
      window.addEventListener("touchmove", this.onDocumentMouseMove, false);
      window.addEventListener('resize', this.onWindowResize, false);
      window.addEventListener("load", this.onLoad, false);
      this.animate();
    }

    componentWillUnmount() {
        this.stop();
        this.audioElement.removeEventListener("loadstart", this.audioElementLoaded, false);
        window.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        window.removeEventListener('resize', this.onWindowResize, false);
        window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
        window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
        window.removeEventListener("load", this.onLoad, false);
        this.mount.removeChild(this.renderer.domElement);
    }

    onWindowResize = debounce(() => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);

    init = () => {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();//{ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        // this.renderer.setClearColor(0x000000);
        this.camera = new THREE.Camera(50, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 700; 
        this.scene.add(this.camera);
        // this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
        this.camera.position.set(0, 0, 100);
        this.camera.target = new THREE.Vector3(0, 0, 0);
        // this.cubeCamera = new THREE.CubeCamera( 0.1, 10000, 128 );
        // this.scene.add(this.cubeCamera);
           // this.controls = new OrbitControls(this.camera);
        // this.controls = new FirstPersonControls(this.camera);
        // this.controls.enabled = true;
        // this.controls.mouseMotionActive = false;
        // this.controls.lookSpeed = .05;
        this.clock = new THREE.Clock();
        this.addWater();
        this.mount.appendChild(this.renderer.domElement);
    }

    createCurvy(){
        // Define the curve
        var closedSpline = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( -60, -100,  60 ),
            new THREE.Vector3( -60,   20,  60 ),
            new THREE.Vector3( -60,  120,  60 ),
            new THREE.Vector3(  60,   20, -60 ),
            new THREE.Vector3(  60, -100, -60 )
        ] );
        closedSpline.type = 'catmullrom';
        closedSpline.closed = true;

        // Set up settings for later extrusion
        var extrudeSettings = {
            steps           : 100,
            bevelEnabled    : false,
            extrudePath     : closedSpline
        };

        // Define a triangle
        var pts = [], count = 3;
        for ( var i = 0; i < count; i ++ ) {
            var l = 20;
            var a = 2 * i / count * Math.PI;
            pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
        }
        var shape = new THREE.Shape( pts );

        // Extrude the triangle along the CatmullRom curve
        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: true } );

        // Create mesh with the resulting geometry
        return new THREE.Mesh( geometry, material );
    }

    addWater(){
      
        let imgObj1= {
            type: 'image',
            name: 'riverImg1',   
            url: assetPath8("images/tiny3.png"),
            position: [0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
        }                    
        let imgMesh1 = loadImage(imgObj1)
        imgMesh1.geometry.computeBoundingBox();
        let imgObj2 = {
            type: 'image',
            name: 'riverImg2',
            url: assetPath8("images/tiny2.png"),
            position: [0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
        }

        let imgMesh2 = loadImage(imgObj2)
      
        let curvy = this.createCurvy();
        this.scene.add(curvy);
        // let waterPlane = curvy.geometry;
        
        let waterPlane = new THREE.PlaneBufferGeometry(1000, 1000);//boxSize.x, boxSize.y);
        this.waterMaterial = new THREE.ShaderMaterial({
            fragmentShader: riverFragmentShader,
            vertexShader: riverVertexShader,
            uniforms: {
                u_time: { type: 'f', value: 1.0 },
                u_resolution: { type: "v2", value: new THREE.Vector2() },
                iChannel0: {
                    value: imgMesh1.material.map
                },
                iChannel1: {
                    value: imgMesh2.material.map
                }
            }
        });
    
        this.waterMaterial.uniforms.iChannel0.value.wrapS = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel1.value.wrapS = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.waterMaterial.uniforms.u_resolution.value.y = this.renderer.domElement.height;
        let waterMesh = new THREE.Mesh(waterPlane, this.waterMaterial);
        // waterMesh.rotateX -= Math.PI / 4.0;
        this.scene.add(waterMesh);
    }


    // chromaVid(){
    // this.videoPlane = new THREE.PlaneBufferGeometry(16, 9);
    // const videoObj = {
    //     type: 'video',
    //     mimetype: 'video/mp4',
    //     name: 'MVI_9621-CHORUS',
    //     sources: multiSourceVideo('MVI_9621-CHORUS'),
    //     geometry: this.videoPlane,
    //     position: [0, 0, 0],
    //     playbackRate: 1,
    //     loop: true,
    //     invert: false,
    //     volume: 1,
    //     muted: false,
    //     // axis: new THREE.Vector3(0, 1, 0).normalize(),
    //     angle: 0.0,
    // };
    //let videoMesh = loadVideo({...videoObj})
    // let video = document.createElement('video')s;
    // video.crossOrigin = 'anonymous';
    // for (let i = 0; i < videoObj.sources.length; i++) {
    //     /* First source element creation */
    //     let src = document.createElement("source");
    //     // Attribute settings for my first source
    //     src.setAttribute("src", videoObj.sources[i].src);
    //     src.setAttribute("type", videoObj.sources[i].type);
    //     video.appendChild(src);
    // }
    // video.load();
    // // document.body.appendChild(video);
    // video.loop = true;
    // let videoTexture = new THREE.VideoTexture(video);
    // videoTexture.minFilter = THREE.LinearFilter;
    // videoTexture.magFilter = THREE.LinearFilter;
    // const loader = new THREE.TextureLoader();
    // const channel0 = loader.load(assetPath8('/images/delme.png')); //https://res.cloudinary.com/di4jisedp/image/upload/v1523722553/wallpaper.jpg')
    //console.log("IMG", videoMesh);
    // SORT OF WORKING
    // this.chromaPlane = new THREE.PlaneBufferGeometry(height, width);
    // this.chromaMaterial = new THREE.ShaderMaterial({
    //     uniforms: {
    //         iTime: { type: 'f', value: 0.0 },
    //         iChannel0: { value: videoMesh.material.map }
    //     },
    //     vertexShader: chromaVertexShader,
    //     fragmentShader: chromaFragmentShader,
    //     transparent: true
    // });
    // this.chromaMesh = new THREE.Mesh(this.videoPlane, this.chromaMaterial);
    // this.scene.add(this.chromaMesh);
    // videoMesh.userData.video.play();
    // END SORT OF WORKING
// }

    animate = () => {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderScene();
    }

    renderScene = () => {   
        const {renderer, scene, camera, clock, waterMaterial, cubeCamera} = this;
        const elapsed = clock.getElapsedTime();
        // this.controls.update(this.clock.getDelta());
        waterMaterial.uniforms.u_time.value += 0.05;//elapsed;//1/10000.; //this.clock.getDelta(); // 1 / 60.0;

        // cubeCamera.update( renderer, scene );

        // this.chromaMaterial.uniforms.iTime.value = this.clock.getElapsedTime();
        // this.waterMaterial.uniforms.iTime.value = elapsed;
        // this.composer.render();
        renderer.render(scene, camera);
        // console.log("CAM POS", this.camera.position);
        // this.composer.render(); 
    }

    render() {
        return (
                <Fragment>
                    {/* <Menu
                    content={CONTENT[window.location.pathname]}
                    audioRef={el => this.audioElement = el}
                    didEnterWorld={() => { this.hasEntered = true }}
                /> */}
                <div
                        className="release"
                    id="release008"
                        ref={(mount) => {
                            this.mount = mount
                        }}
                    />
                </Fragment>
            );
    }
}

export default Release0008_GreemJellyFish;