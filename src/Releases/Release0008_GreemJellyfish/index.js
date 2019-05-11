import React, { Component, Fragment } from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import '../Release.css';


import { loadImage, loadGLTF } from "../../Utils/Loaders";
import { CONTENT } from '../../Content'
import Player from '../../UI/Player/Player'
import '../../UI/Player/Player.css';
// import { FirstPersonControls } from "../../Utils/FirstPersonControls";
// import { OrbitControls } from "../../Utils/OrbitControls";
import { FirstPersonControls } from "../../Utils/FirstPersonControls";
import GLTFLoader from 'three-gltf-loader';
import {
    OFFICE,
    FALLING,
    FOREST,
    REBECCA,
    ALEXA,
    DENNIS,
    TRACK_SECTIONS,
    CONSTANTS
} from "./constants.js";
import { assetPath8 } from "./utils.js";

/* eslint import/no-webpack-loader-syntax: off */
import chromaVertexShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import chromaFragmentShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyFragment.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverVertexShader from '!raw-loader!glslify-loader!../../Shaders/riverVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import riverFragmentShader from '!raw-loader!glslify-loader!../../Shaders/riverFragment.glsl';
import { notEqual } from 'assert';

const ANIMATION_CLIP_NAMES = CONSTANTS.animationClipNames;
const SPRITE_NAMES = CONSTANTS.spriteNames;
export default class Release0008_GreemJellyFish extends Component {
    state = {
        location: TRACK_SECTIONS[0].location,
        section: TRACK_SECTIONS[0],
    }

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

    componentDidUpdate = (prevProps, prevState) => {
        const { section } = this.state;
        if (prevState.section.location !== section.location) {
            this.updateLocation(prevState.section.location, section.location);
        }
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
        this.camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 15000);
        // this.camera.position.set(3900, 600, 5800);
        this.camera.position.set(4, 1.2, -2.4);
        // this.camera.position.set(0, 1, 0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        const manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(manager);
        this.textureLoader = new THREE.TextureLoader();
        this.controls = new FirstPersonControls(this.camera);
        const FIRST_PERSON_CONTROL_SPEED = .1;
        const FIRST_PERSON_CONTROL_MOVEMENT = 10;
        this.controls.lookSpeed = .05;
        this.controls.movementSpeed = FIRST_PERSON_CONTROL_MOVEMENT;
        this.controls.enabled = true;
        this.controls.mouseMotionActive = false;//true;
        this.clock = new THREE.Clock();
        // release-specific objects
        this.waterMaterials = {};
        this.spriteAnimations = {};
        this.office = undefined;
        this.chromaMesh = undefined;
        // release-specific initilization
        this.locations = {}
        this.initLights();
        // this.initTube();
        this.initChromaVidMaterial();
        this.initSprites();
        this.initOffice();
        this.initForest();
        this.initFalling();
        this.initScene();
    }

    // TODO setup callback pattern on gltf loads rather than set interval...
    initScene() {
        const { locations } = this;
        const { location } = this.state;
        const refreshId = setInterval(() => {
            if (locations[location]) {
                locations[location].visible = true;
                clearInterval(refreshId);
            }
        }, 100);
    }

    initWaterMaterial = (alpha, waterY, name, side) => {
        const { textureLoader } = this;
        const rockTexture1 = textureLoader.load(assetPath8("images/tiny3.png"))
        const rockTileTexture2 = textureLoader.load(assetPath8("images/tiny2.png"));
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
            side: side ? side : THREE.FrontSide
        });
        // potentially add env map: view-source:https://2pha.com/demos/threejs/shaders/fresnel_cube_env.html
        // waterMaterial.uniforms.envMap = textureEquirec
        waterMaterial.uniforms.u_alpha = { type: 'f', value: alpha || 1.0 };
        waterMaterial.uniforms.waterY = { type: 'f', value: waterY };
        waterMaterial.uniforms.lightIntensity = { type: 'f', value: 1.0 };
        waterMaterial.uniforms.textureSampler = { type: 't', value: rockTileTexture2 }; //imgMesh2.material.map };
        waterMaterial.uniforms.u_time = { type: 'f', value: 1.0 };
        waterMaterial.uniforms.u_resolution = { type: "v2", value: new THREE.Vector2() };
        waterMaterial.uniforms.iChannel0 = { value: rockTileTexture2 }; //imgMesh1.material.map };
        waterMaterial.uniforms.iChannel1 = { value: rockTileTexture2 };//imgMesh2.material.map };
        waterMaterial.uniforms.iChannel0.value.wrapS = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel1.value.wrapS = THREE.RepeatWrapping;
        waterMaterial.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
        waterMaterial.uniforms.u_resolution.value.x = this.renderer.domElement.width;
        waterMaterial.uniforms.u_resolution.value.y = this.renderer.domElement.height;
        this.waterMaterials[name] = waterMaterial;
        return waterMaterial;
    }

    initChromaVidMaterial = () => {
        const refreshId = setInterval(() => {
            if (CONSTANTS.auxMedia[0].media) {
                let videoMesh = CONSTANTS.auxMedia[0].mesh;
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
                let chromaPlane = new THREE.PlaneBufferGeometry(16, 9);
                this.chromaMesh = new THREE.Mesh(chromaPlane, this.chromaMaterial);
                this.chromaMesh.userData.location = undefined;
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
        // add subtle ambient lighting
        var ambientLight = new THREE.AmbientLight(0xbbbbbb);
        scene.add(ambientLight);
        // directional lighting
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    }

    initFalling = () => {
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
        tube.visible = false;
        scene.add(tube);
        this.locations[FALLING] = tube;
    }

    initForest() {
        const { gltfLoader } = this;
        const name = "office";
        const gltfParams = {
            url: assetPath8('objects/blocky-rocks/waterfall.gltf'),
            name: name,
            position: [5, 0, -15],
            rotateX: 0,
            rotateY: 180,
            rotateZ: 0,
            relativeScale: 1,//.05,
            loader: gltfLoader,
            onSuccess: (gltf) => {
                const { scene, waterMaterials } = this;
                const waterPlane = gltf.scene.getObjectByName('WaterPlane');
                const waterY = 107.;
                const waterMaterialName = "waterfall";
                const alpha = .1;
                const side = THREE.DoubleSide;
                // add water
                let waterMaterial = this.initWaterMaterial(alpha, waterY, waterMaterialName, side);
                waterPlane.material = waterMaterial;
                // add rock material
                let rockMaterial = this.initRockMaterial();
                const object = gltf.scene.getObjectByProperty('mesh');
                object.traverse(function (node) {
                    if (node.name.includes("rock")) {
                        node.material = rockMaterial;
                    }
                });
                const forest = gltf.scene;
                forest.visible = false;
                scene.add(forest);
                this.waterFall = waterPlane;
                this.locations[FOREST] = forest;
            }
        }
        loadGLTF({ ...gltfParams });
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
            relativeScale: 1,
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
                    opacity: 0.5,
                    side: THREE.DoubleSide
                });
                if (object) {
                    object.traverse(function (node) {
                        // if (node.isMesh && CONSTANTS.officeWaterSurfaces.includes(node.name)) {
                        //     node.material = waterMaterial;
                        // } else if (node.isMesh) {
                        node.material = defaultMaterial;
                        // }
                    });
                }
                const office = gltf.scene;
                office.visible = false;
                scene.add(office);
                this.officeWall = office.getObjectByName("walls005_11");
                this.locations[OFFICE] = office;
            }
        }
        loadGLTF({ ...gltfParams });
    }

    initRockMaterial() {
        const { textureLoader } = this;
        var loader = new THREE.CubeTextureLoader();
        loader.setPath(assetPath8('textures/env-maps/'));
        var textureCube = loader.load(Array(6).fill('office-space1.jpg'));
        const normalMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-normal.png"));
        const roughnessMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-rough.png"));
        const metalnessMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-metal.png"));
        var aoMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-ao.png"));
        var displacementMap = textureLoader.load(assetPath8("textures/copper-rock/copper-rock1-height"));
        // TODO playaround
        return new THREE.MeshStandardMaterial({
            color: 0xff3366,//ffffff,
            roughness: .4,
            metalness: .5,
            skinning: true,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            metalnessMap: metalnessMap,
            aoMap: aoMap,
            displacementMap: displacementMap,
            displacementScale: 2.4, // TODO play around
            displacementBias: - 0.428408, // TODO play around
            envMap: textureCube
        });
    }

    initSprites = () => {
        const { gltfLoader } = this;
        const alexaParams = {
            url: assetPath8("objects/alexa/alexa.gltf"),
            name: ALEXA,
            position: [4, 0, -5],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: this.onSpriteLoad
        }
        loadGLTF({ ...alexaParams });
        const rebeccaParams = {
            url: assetPath8("objects/rebecca/rebecca.gltf"),
            name: REBECCA,
            position: [2, 0, -8],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: this.onSpriteLoad
        }
        loadGLTF({ ...rebeccaParams });
        const dennisParams = {
            url: assetPath8("objects/dennis/dennis.gltf"),
            name: DENNIS,
            position: [5, .1, -8],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: this.onSpriteLoad
        }
        loadGLTF({ ...dennisParams })
    }

    onSpriteLoad = (gltf) => {
        const { section } = this.state;
        const { scene, spriteAnimations } = this;
        // setup material
        const object = gltf.scene.children[0].getObjectByProperty('mesh');
        const rockMaterial = this.initRockMaterial();
        if (object) {
            object.traverse(function (node) {
                node.material = rockMaterial;
            });
        }
        scene.add(gltf.scene);
        // setup animation collection
        // one mixer per object
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const firstClip = THREE.AnimationClip.findByName(
            gltf.animations,
            ANIMATION_CLIP_NAMES[section.location][0]
        );
        mixer.clipAction(firstClip).play();
        spriteAnimations[gltf.name] = {
            mixer: new THREE.AnimationMixer(gltf.scene),
            clips: gltf.animations,
            curClip: firstClip,
        };
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
            // TODO - check if we can use this check for efficiency
            if (waterMaterials[objName].visible) {
                waterMaterials[objName].uniforms.u_time.value += 0.5;
            }
            //waterMaterials[objName].uniforms.lightIntensity.value = lightIntensity;
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

    transitionAnimation(spriteAnimation, nextClipName) {
        const curClip = spriteAnimation.curClip;
        if (nextClipName != curClip.name) {
            const nextClip = THREE.AnimationClip.findByName(spriteAnimation.clips, nextClipName);
            const curAction = spriteAnimation.mixer.clipAction(curClip)
            const nextAction = spriteAnimation.mixer.clipAction(nextClip);
            const fadeInTime = 1.;
            nextAction.enabled = true; // This needs to be set...
            nextAction.play()
            curAction.crossFadeTo(nextAction, fadeInTime);
            spriteAnimation.curClip = nextClip;
        }
    }

    updateSpriteAnimations() {
        const { section } = this.state;
        const { spriteAnimations } = this;
        const clipNames = ANIMATION_CLIP_NAMES[section.location]; // clip names by location
        const currentTime = this.getVideoCurrentTime();
        const timeLeftInSection = section.end - currentTime;
        const proportionOfSectionCompleted = 1. - timeLeftInSection / parseFloat(section.length);
        for (const spriteName in spriteAnimations) {
            const spriteAnimation = spriteAnimations[spriteName];
            if (!spriteAnimation) continue; // TODO these is an onLoad/init issue...
            // just toggling between two animations per section...
            const clipName = clipNames[0];
            if (proportionOfSectionCompleted > .5 && clipNames.length > 1) clipName = clipNames[1];
            this.transitionAnimation(spriteAnimation, clipName)
            spriteAnimation.mixer.update(.1);
        }
    }

    updateLocation(prevLocation, curLocation) {
        const { locations } = this;
        locations[prevLocation].visible = false;
        locations[curLocation].visible = true;
    }

    getVideoCurrentTime() {
        const { chromaMesh } = this;
        if (!chromaMesh) return 0;
        return chromaMesh.material.uniforms.iChannel0.value.image.currentTime;
    }

    updateVideo() {
        const { officeWall, waterFall, chromaMesh, chromaMaterial, clock } = this;
        const { location } = this.state;
        if (chromaMesh) {
            if (chromaMesh.userData.location != location) {
                // TODO need to set declaritive positions rather than adding/subtracting since it is the same object being moved to totally different locations
                if (location === OFFICE && officeWall) {
                    chromaMesh.position.y += .2;
                    chromaMesh.position.z += 1.5;
                    chromaMesh.rotation.x += Math.PI / 2;
                    chromaMesh.scale.set(.3, .3, .3);
                    officeWall.add(chromaMesh);
                }
                if (location === FOREST && waterFall) {
                    waterFall.add(chromaMesh)
                }
                chromaMesh.userData.location = location;
            }
            chromaMaterial.uniforms.u_time.value = clock.getElapsedTime();
        }
    }

    updateTrackSection() {
        const { section } = this.state;
        const { locations, chromaMesh } = this;
        const forest = locations[FOREST];
        const office = locations[OFFICE];
        if (!forest || !office) return; // onload...
        if (!chromaMesh) return;
        const currentTime = this.getVideoCurrentTime();
        for (const idx in TRACK_SECTIONS) {
            const trackSection = TRACK_SECTIONS[idx];
            if (currentTime >= trackSection.start && currentTime < trackSection.end) {
                if (section !== trackSection) {
                    this.setState({
                        section: trackSection
                    })
                }
                break;
            }
        }
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock } = this;
        // let lightIntensity = this.updateLights(); // TODO currently too computationally intensive
        this.updateWaterMaterials();
        this.updateSpriteAnimations();
        this.updateTrackSection();
        // TODO controls will lock, order matters here (updating control before updating video; not sure why)
        controls.update(clock.getDelta());
        this.updateVideo();
        renderer.render(scene, camera);
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
                <div className="release" id="greemJellyFishFlyer">
                    <div ref={(element) => this.container = element} />}
                </div>
                {this.renderPlayer()}
            </Fragment>
        );
    }
}