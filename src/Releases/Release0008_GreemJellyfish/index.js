import React, { PureComponent, Fragment } from 'react';
import * as THREE from "three";
import { RenderPass, ShaderPass, CopyShader, EffectComposer, ThreeMFLoader } from "three-full";
import debounce from 'lodash/debounce';
import '../Release.css';
import { assetPath } from "../../Utils/assets";
import AudioStreamer from "../../Utils/Audio/AudioStreamer";
import { loadVideo, loadImage } from "../../Utils/Loaders";
import Menu from '../../UI/Menu/Menu';
import { CONTENT } from '../../Content'
import { FirstPersonControls } from "../../Utils/FirstPersonControls";
import { OrbitControls } from "../../Utils/OrbitControls";

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
        //   window.addEventListener('mousemove', this.onDocumentMouseMove, false);
        //   window.addEventListener("touchstart", this.onDocumentMouseMove, false);
        //   window.addEventListener("touchmove", this.onDocumentMouseMove, false);
        window.addEventListener('resize', this.onWindowResize, false);
        this.animate();
    }

    componentWillUnmount() {
        this.stop();
        window.removeEventListener('resize', this.onWindowResize, false);
        // window.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        // window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
        // window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
        this.container.removeChild(this.renderer.domElement);
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    onWindowResize = debounce(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
    }, 50);

    init = () => {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFF0FFF);
        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 0, 4);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        this.scene.add(new THREE.AmbientLight(0xff00ff));
        // this.controls = new FirstPersonControls(this.camera);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        // this.controls.lookSpeed = .05;
        this.clock = new THREE.Clock();
        this.addWater();
        this.addChromaVid();
    }

    createWaterVessel() {
        // Define the curve
        let openSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(-3, 1, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(4, 0,  0),
            new THREE.Vector3(5, -1, 0)
        ]);
        openSpline.type = 'catmullrom';
        openSpline.closed = false;
        // Set up settings for later extrusion
        let extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: openSpline
        };
        // Define a polygon
        let pts = [], count = 4;
        for (let i = 0; i < count; i++) {
            let l = .1;
            let a = 2 * i / count * Math.PI;
            pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
        }
        let shape = new THREE.Shape(pts);
        // Extrude the triangle along the CatmullRom curve
        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let material = new THREE.MeshPhongMaterial({ color: 0xb00000 });
        // Create mesh with the resulting geometry
        return new THREE.Mesh(geometry, material);
    }

    addWater() {
        let imgObj1 = {
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
        let curvy = this.createWaterVessel();
        let waterGeom = curvy.geometry;
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
            },
            side: THREE.DoubleSide,
            skinning: true,
            transparent: true,
        });
        this.waterMaterial.uniforms.iChannel0.value.wrapS = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel1.value.wrapS = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
        this.waterMaterial.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        this.waterMaterial.uniforms.u_resolution.value.y = this.renderer.domElement.height;
        let waterMesh = new THREE.Mesh(waterGeom, this.waterMaterial);
        waterMesh.position.z -= 1;
        this.scene.add(waterMesh);
    }

    addChromaVid(){
        this.videoPlane = new THREE.PlaneBufferGeometry(1, 1);
        const videoObj = {
            type: 'video',
            mimetype: 'video/mp4',
            name: 'MVI_9621-CHORUS',
            sources: multiSourceVideo('MVI_9621-CHORUS'),
            geometry: this.videoPlane,
            position: [0, 0, 0],
            playbackRate: 1,
            loop: true,
            invert: false,
            volume: 1,
            muted: false,
            axis: new THREE.Vector3(0, 0, 0).normalize(),
            angle: 0.0,
        };
        let videoMesh = loadVideo({...videoObj})
        this.chromaPlane = new THREE.PlaneBufferGeometry(16, 9);//window.innerHeight, window.innerWidth);
        this.chromaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { type: 'f', value: 0.0 },
                iChannel0: { value: videoMesh.material.map }
            },
            vertexShader: chromaVertexShader,
            fragmentShader: chromaFragmentShader,
            transparent: true
        });
        this.chromaMesh = new THREE.Mesh(this.chromaPlane, this.chromaMaterial);
        this.scene.add(this.chromaMesh);
        videoMesh.userData.video.play();
    }

    animate = () => {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderScene();
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock, waterMaterial, chromaMaterial } = this;
        waterMaterial.uniforms.u_time.value += 0.05;
        chromaMaterial.uniforms.u_time.value = this.clock.getElapsedTime();
        controls.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    render() {
        return (
            <Fragment>
                {/* <Menu
                    content={CONTENT[window.location.pathname]}
                    audioRef={el => this.audioElement = el}
                    didEnterWorld={() => { this.hasEntered = true }}
                /> */}
                <div className="release" id="release008">
                    <div ref={(element) => this.container = element} />}
                </div>
            </Fragment>
        );
    }
}

export default Release0008_GreemJellyFish;