import React, { PureComponent, Fragment } from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import '../Release.css';
import { assetPath } from "../../Utils/assets";
import { loadVideo, loadImage, loadGLTF } from "../../Utils/Loaders";
import Menu from '../../UI/Menu/Menu';
import { CONTENT } from '../../Content'
import { OrbitControls } from "../../Utils/OrbitControls";
import GLTFLoader from 'three-gltf-loader';

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
        // main initialization parameters
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFF0FFF);
        this.camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 1, 10000);
        // this.camera.position.set(0, 5, 556);
        this.camera.position.set(4900, 900, 6800);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        const manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(manager);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.clock = new THREE.Clock();
        // release-specific objects
        this.waterMaterials = {};
        this.sprites = [];
        this.animations = {};
        
        // release-specific initilization
         this.textSequence = this.loadTextSequence(this.textSequence);

        this.addLights();
        this.addTube();
        this.addOffice();
        // this.addSprites();
        this.addChromaVid();
        
    }

    loadTextSequence(){
        const {scene, gltfLoader} = this;
        let textSequence = [];
        const texts = [
            {path: assetPath8("objects/flyer/greem-jellyfish.gltf"), name: "greem-jellyfish-text"},
            {path: assetPath8("objects/flyer/globally-ltd.gltf"), name: "globally-ltd-text"}
        ]
        for (let i = 0; i < texts.length; i ++){
            const text = texts[i];
            const gltfParams = {
                url: text.path,
                name: text.name,
                position: [350, 0, 0],
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                relativeScale: 40,
                loader: gltfLoader,
                onSuccess: (gltf) => {
                    textSequence.push({
                        obj: gltf.scene,
                        isActive: text.name === "greem-jellyfish-text"
                    });
                    scene.add(gltf.scene);
                }
            }
            loadGLTF({ ...gltfParams });
        }
        return textSequence;
    }

    initWaterMaterial(alpha, waterY) {
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
        imgMesh1.magFilter = THREE.NearestFilter;
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
        let waterMaterial = new THREE.ShaderMaterial({
            fragmentShader: riverFragmentShader,
            vertexShader: riverVertexShader,
            lights: true,
            fog: true,
            transparent: true,
            needsUpdate: true,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
            ]),
            // side: THREE.DoubleSide
        });
        waterMaterial.uniforms.u_alpha = { type: 'f', value: alpha || 1.0 };
        waterMaterial.uniforms.waterY = { type: 'f', value: waterY };
        waterMaterial.uniforms.lightIntensity = { type: 'f', value: 1.0 };
        waterMaterial.uniforms.textureSampler = { type: 't', value: imgMesh2.material.map };
        waterMaterial.uniforms.u_time = { type: 'f', value: 1.0 };
        waterMaterial.uniforms.u_resolution = { type: "v2", value: new THREE.Vector2() };
        waterMaterial.uniforms.iChannel0 = { value: imgMesh1.material.map };
        waterMaterial.uniforms.iChannel1 = { value: imgMesh2.material.map };
        waterMaterial.uniforms.iChannel0.value.wrapS = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel1.value.wrapS = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
        waterMaterial.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        waterMaterial.uniforms.u_resolution.value.y = this.renderer.domElement.height;
        return waterMaterial;
    }

    addLights() {
        const { scene } = this;
        scene.add(new THREE.AmbientLight(0x0fffff));
        this.pointLight = new THREE.PointLight(0xfff000, 1, 100);
        this.pointLight.userData.angle = 0.0;
        this.pointLight.castShadow = true;
        this.pointLight.position.set(0, 2, 2);
        scene.add(this.pointLight);
        // const sphereSize = 1;
        // const pointLightHelper = new THREE.PointLightHelper(this.pointLight, sphereSize);
        // scene.add(pointLightHelper);
    }

    initTube() {
        // Define the curve
        let spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 5, 1),
            new THREE.Vector3(-10, -5, 1),
            new THREE.Vector3(-7, -5, 0),
            new THREE.Vector3(-5, -5, 0),
            new THREE.Vector3(-3, -5, 0),
            new THREE.Vector3(0, -5, 0),
            new THREE.Vector3(4, -5, 0),
            new THREE.Vector3(7, -5, -1),
            new THREE.Vector3(10, -5, -1),
            new THREE.Vector3(20, 5, -1)
        ]);
        spline.type = 'catmullrom';
        spline.closed = true;
        // Set up settings for later extrusion
        let extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: spline
        };
        // Define a polygon
        let pts = [], count = 7;
        for (let i = 0; i < count; i++) {
            let l = 1;
            let a = 2 * i / count * Math.PI;
            pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
        }
        let shape = new THREE.Shape(pts);
        // Extrude the triangle along the CatmullRom curve
        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshPhongMaterial({ color: 0xb00000 });
        // Create mesh with the resulting geometry
        return new THREE.Mesh(geometry, material);
    }

    addOffice() {
        const { gltfLoader } = this;

        const gltfParams = {
            url: assetPath8('objects/office/scene.gltf'),
            name: "office",
            position: [0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 15,
            loader: gltfLoader,
            onSuccess: this.onAddOfficeSuccess,
        }
        loadGLTF({ ...gltfParams });
    }

    onAddOfficeSuccess = (gltf) => {
        const { scene, waterMaterials } = this;
        const alpha = .1;
        const waterY = 107.;
        let waterMaterial = this.initWaterMaterial(alpha, waterY);
        waterMaterials["office"] = waterMaterial;
        const object = gltf.scene.children[0].getObjectByProperty('mesh');
        if (object) {
            object.traverse(function (node) {
                if (node.isMesh) {
                    node.material = waterMaterial;
                }
            });
        }
        gltf.scene.position.y -= 10;
        gltf.scene.position.z += 10;
        gltf.scene.rotation.y += Math.PI / 5.0;
        scene.add(gltf.scene);
    }

    addTube() {
        const { scene, waterMaterials } = this;
        let tube = this.initTube();
        let alpha = 1.0; // TODO not working
        const waterY = 28.;
        let waterMaterial = this.initWaterMaterial(alpha, waterY);
        waterMaterials["tube"] = waterMaterial;
        tube.material = waterMaterial;
        tube.position.z += 1.;
        scene.add(tube);
    }

    addSprites() {
        const { gltfLoader } = this;
        const rebeccaParams = {
            url: assetPath8("objects/rebecca/rebecca.gltf"),
            name: "rebecca",
            position: [0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: gltf => this.onSpriteLoad(gltf)
        }
        loadGLTF({ ...rebeccaParams });
    }

    onSpriteLoad = (gltf) => {
        const { scene } = this;
        scene.add(gltf.scene);
        this.setupModelAnimation(gltf);
        this.sprites.push(gltf);
    }

    setupModelAnimation(gltf) {
        const { animations } = this;
        // one mixer per object
        let mixer = new THREE.AnimationMixer(gltf.scene);
        animations[gltf.name] = {
            mixer: mixer,
            clips: gltf.animations
        };
    }

    addChromaVid() {
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
            muted: true,
            axis: new THREE.Vector3(0, 0, 0).normalize(),
            angle: 0.0,
        };
        let videoMesh = loadVideo({ ...videoObj })
        this.chromaPlane = new THREE.PlaneBufferGeometry(16, 9);
        this.chromaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { type: 'f', value: 0.0 },
                iChannel0: { value: videoMesh.material.map }
            },
            vertexShader: chromaVertexShader,
            fragmentShader: chromaFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.chromaMesh = new THREE.Mesh(this.chromaPlane, this.chromaMaterial);
        this.scene.add(this.chromaMesh);
        videoMesh.userData.video.addEventListener("canplay", () => {
            setInterval(() => {
                const video = videoMesh.userData.video;
                if (this.mediaElement && !this.mediaElement.paused && video.paused) {
                    videoMesh.userData.video.play();
                }
            }, 100);
        })
    }

    animate = () => {
        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderScene();
    }

    updateWaterMaterials(lightIntensity) {
        const { waterMaterials } = this;
        for (const objName in waterMaterials) {
            waterMaterials[objName].uniforms.u_time.value += 0.05;
            waterMaterials[objName].uniforms.lightIntensity.value = lightIntensity;

        }
    }

    updateLights() {
        const { clock, pointLight } = this;
        pointLight.userData.angle -= 0.025;
        let lightIntensity = 0.75 + 0.25 * Math.cos(clock.getElapsedTime() * Math.PI);
        pointLight.position.x = 10 + 10 * Math.sin(pointLight.userData.angle);
        pointLight.position.y = 10 + 10 * Math.cos(pointLight.userData.angle);
        pointLight.color.setHSL(lightIntensity, 1.0, 0.5);
        return lightIntensity;
    }

    updateTextSequence(){
        const {textSequence } = this;
        for (let i =0; i < textSequence.length; i++){
            let txt = textSequence[i];
            if (txt.isActive){
                txt.obj.position.x -= 1;
                if (txt.obj.position.x <= -30){
                    txt.isActive = false;
                    const nextActiveIdx = i + 1 == textSequence.length ? 0 : i;
                    console.log("NEXT ACTIVE:", nextActiveIdx)
                    textSequence[nextActiveIdx].isActive = true;

                }
            }
        }
    }

    updateSpriteAnimations() {
        const { clock, animations } = this;
        // TODO figure out how to organize this and where to put it (probably in constants)
        const animationMap = {
            rebecca: {
                sadWorldClips: [
                    "Defeated",
                    "SadHandsClasped"
                ]
            }
        }
        const animation = animations["rebecca"];    
        // play/pause/blend animations
        if (this.mediaElement.currentTime >= 1 && this.mediaElement.currentTime < 5) {
            animation.curClip = THREE.AnimationClip.findByName(animation.clips, "Defeated")
            animation.action = animation.mixer.clipAction(animation.curClip)
            animation.action.play();
        } else if (this.mediaElement.currentTime >= 5 && animation.curClip.name != "SadHandsClasped") {
            animation.curClip = THREE.AnimationClip.findByName(animation.clips, "SadHandsClasped")
            let nextAction = animation.mixer.clipAction(animation.curClip);
            nextAction.play();
            const fadeInTime = 1;
            animation.action.crossFadeTo(nextAction, fadeInTime); //crossFadeTo(nextAction, fadeInTime);
            animation.action = nextAction;
        }
        // update all mixers
        for (const objName in animations) {
            animations[objName].mixer.update(.1);// TODO clock.getDelta() is not the value you're looking for here...;
        }
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock, chromaMaterial } = this;
        let lightIntensity = this.updateLights();
        this.updateWaterMaterials(lightIntensity);
        this.updateTextSequence();
        // this.updateSpriteAnimations();
        // chromaMaterial.uniforms.u_time.value = this.clock.getElapsedTime();
        controls.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    render() {
        return (
            <Fragment>
                <Menu
                    content={CONTENT[window.location.pathname]}
                    mediaRef={el => this.mediaElement = el}
                    didEnterWorld={() => { this.hasEntered = true }}
                />
                <div className="release" id="release008">
                    <div ref={(element) => this.container = element} />}
                </div>
            </Fragment>
        );
    }
}

export default Release0008_GreemJellyFish;