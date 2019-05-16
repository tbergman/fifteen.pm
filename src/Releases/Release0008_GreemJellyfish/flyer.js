import React, { Component, Fragment } from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import '../Release.css';
import './flyer.css';

import { assetPath } from "../../Utils/assets";
import { loadImage, loadGLTF } from "../../Utils/Loaders";
import { CONTENT } from '../../Content'
import Player from '../../UI/Player/Player'
import '../../UI/Player/Player.css';
import { OrbitControls } from "../../Utils/OrbitControls";
import GLTFLoader from 'three-gltf-loader';
import { CONSTANTS } from "./flyerConstants.js";

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

class Release0008_GreemJellyFish_EventFlyer extends Component {
    componentDidMount() {
        this.init();
        window.addEventListener('mousemove', this.onDocumentMouseMove, false);
        window.addEventListener("touchstart", this.onDocumentMouseMove, false);
        window.addEventListener("touchmove", this.onDocumentMouseMove, false);
        window.addEventListener('resize', this.onWindowResize, false);
        this.animate();
    }

    componentWillUnmount() {
        this.stop();
        window.removeEventListener('resize', this.onWindowResize, false);
        window.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        window.removeEventListener("touchstart", this.onDocumentMouseMove, false);
        window.removeEventListener("touchmove", this.onDocumentMouseMove, false);
        this.container.removeChild(this.renderer.domElement);
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    onDocumentMouseMove() {
    }

    onWindowResize = debounce(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }, 50);

    init = () => {
        // main initialization parameters
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFF0FFF);
        this.camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 1, 15000);
        this.camera.position.set(3900, 600, 5800);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        const manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(manager);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
        this.controls.minDistance = 250;
        this.controls.maxDistance = 10000;
        this.clock = new THREE.Clock();
        // release-specific objects
        this.waterMaterials = {};
        this.sprites = [];
        this.spriteAnimations = {};
        this.office = undefined;
        this.chromaMesh = undefined;
        // release-specific initilization
        this.initLights();
        this.initTube();
        this.initChromaVid(); // order matters... everything that will be in/on office should load first... write a chain?
        // this.initSprites();
        this.initOffice();
    }

    initWaterMaterial = (alpha, waterY, name) => {
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
        // potentially add env map: view-source:https://2pha.com/demos/threejs/shaders/fresnel_cube_env.html
        // waterMaterial.uniforms.envMap = textureEquirec
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
        this.waterMaterials[name] = waterMaterial;
        return waterMaterial;
    }

    initChromaVid = () => {
        const { camera, scene } = this;
        const refreshId = setInterval(() => {
            if (CONSTANTS.auxMedia[0].media) {
                let videoMesh = CONSTANTS.auxMedia[0].mesh;
                let chromaPlane = new THREE.PlaneBufferGeometry(16, 9);
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
                this.chromaMesh = new THREE.Mesh(chromaPlane, this.chromaMaterial);
                this.chromaMesh.position.y -= .5;
                this.chromaMesh.position.z += 1.5;
                this.chromaMesh.rotation.x += Math.PI / 2;
                this.chromaMesh.scale.set(.3, .3, .3);
                this.videoWall.add(this.chromaMesh);
                clearInterval(refreshId);
            }
        }, 100);
    }

    initLights = () => {
        const { scene, camera } = this;
        scene.add(new THREE.AmbientLight(0x0fffff));
        this.pointLight = new THREE.PointLight(0xfff000, 1, 100);
        this.pointLight.userData.angle = 0.0;
        this.pointLight.castShadow = true;
        this.pointLight.position.set(0, 2, 2);
        scene.add(this.pointLight);

        let cameraLight = new THREE.SpotLight(0xfff000, 1, 1000);
        cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);
        camera.add(cameraLight);
        cameraLight.lookAt(new THREE.Vector3());

        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0xbbbbbb);
        scene.add(ambientLight);

        // directional lighting
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    }

    initTube = () => {
        const { scene, waterMaterials } = this;
        // Define the curve
        let spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-100, -50, -10),
            new THREE.Vector3(-55, -40, -10),
            new THREE.Vector3(-50, -40, -10),
            new THREE.Vector3(-40, -20, -4),
            new THREE.Vector3(-30, -25, -6),
            // new THREE.Vector3(0, -5, 0),
            new THREE.Vector3(20, -38, -8),
            new THREE.Vector3(70, -35, -3),
            new THREE.Vector3(90, -25, -2),
            new THREE.Vector3(100, -30, -1)
        ]);
        spline.type = 'catmullrom';
        spline.closed = false;
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
        let material = new THREE.MeshPhongMaterial({ color: 0xb00000 });
        // Create mesh with the resulting geometry
        let tube = new THREE.Mesh(geometry, material);
        let alpha = 1.0; // TODO not working
        const waterY = 28.;
        let waterMaterialName = "tube";
        let waterMaterial = this.initWaterMaterial(alpha, waterY, waterMaterialName);
        tube.material = waterMaterial;
        tube.position.z += 1.;
        scene.add(tube);
    }

    initOffice = () => {
        const { gltfLoader } = this;
        const name = "office";
        const gltfParams = {
            url: assetPath8('objects/office/scene.gltf'),
            name: name,
            position: [0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 15,
            loader: gltfLoader,
            onSuccess: (gltf) => {
                const { scene, waterMaterials } = this;
                const alpha = .1;
                const waterY = 107.;
                let waterMaterial = this.initWaterMaterial(alpha, waterY, name);
                const object = gltf.scene.children[0].getObjectByProperty('mesh');
                const defaultMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFB0082,
                    metalness: 0.5,
                    roughness: 0.0,
                    skinning: true,
                    fog: true,
                    needsUpdate: true,
                    transparent: true,
                    opacity: 0.5
                });
                if (object) {
                    object.traverse(function (node) {
                        if (node.isMesh && CONSTANTS.officeWaterSurfaces.includes(node.name)) {
                            node.material = waterMaterial;
                        } else if (node.isMesh) {
                            node.material = defaultMaterial;
                        }
                    });
                }
                gltf.scene.position.y -= 10;
                gltf.scene.position.z += 10;
                gltf.scene.rotation.y += Math.PI / 5.0;
                this.office = gltf.scene;
                this.office.position.x = -20;//window.innerWidth/2.0;
                // this.office.add(this.chromaMesh);
                this.videoWall = this.office.getObjectByName("walls005_11")
                scene.add(gltf.scene);
            }
        }
        loadGLTF({ ...gltfParams });
    }

    initSprites = () => {
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
            onSuccess: (gltf) => {
                const { scene, spriteAnimations } = this;
                scene.add(gltf.scene);
                // one mixer per object
                let mixer = new THREE.AnimationMixer(gltf.scene);
                spriteAnimations[gltf.name] = {
                    mixer: mixer,
                    clips: gltf.animations
                };
                this.sprites.push(gltf);
            }
        }
        loadGLTF({ ...rebeccaParams });
    }

    animate = () => {
        setTimeout(() => {
            this.frameId = window.requestAnimationFrame(this.animate);
        }, 1000 / 30);
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

    updateSpriteAnimations() {
        const { clock, spriteAnimations } = this;
        // TODO figure out how to organize this and where to put it (probably in constants)
        const animationMap = {
            rebecca: {
                sadWorldClips: [
                    "Defeated",
                    "SadHandsClasped"
                ]
            }
        }
        const animation = spriteAnimations["rebecca"];
        // play/pause/blend spriteAnimations
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
        for (const objName in spriteAnimations) {
            spriteAnimations[objName].mixer.update(.1);// TODO clock.getDelta() is not the value you're looking for here...;
        }
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock, chromaMaterial } = this;
        let lightIntensity = this.updateLights();
        this.updateWaterMaterials(lightIntensity);
        // this.updateSpriteAnimations();
        if (chromaMaterial) {
            chromaMaterial.uniforms.u_time.value = this.clock.getElapsedTime();
        }
        controls.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    renderFlyerInfo() {
        return (
            <Fragment>
                <div className="flyer-info-bottom">
                    <div>Greem Jellyfish and 11:11pm present... Juicy Tender</div>
                </div>
                <div className="flyer-info-right">
                    <div><a href="https://www.instagram.com/182ave.c">Gallery @ 182 Ave. C</a></div>
                    <div>Saturday, May 25</div>
                    <div>7-10PM</div>
                </div>
            </Fragment>
        )
    }

    renderPlayer = () => {
        const content = CONTENT[window.location.pathname];
        return (
            <div className="player">
                <Player
                    trackList={content.tracks}
                    message={content.artist}
                    fillColor={content.theme.iconColor}
                    mediaRef={element => this.mediaElement = element}
                    auxMedia={CONSTANTS.auxMedia}
                />
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                {this.renderFlyerInfo()}
                <div className="release" id="greemJellyFishFlyer">
                    <div ref={(element) => this.container = element} />}
                </div>
                {this.renderPlayer()}
            </Fragment>
        );
    }
}

export default Release0008_GreemJellyFish_EventFlyer;