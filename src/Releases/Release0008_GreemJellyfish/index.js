import React, { Component, Fragment } from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import '../Release.css';


import { loadImage, loadGLTF } from "../../Utils/Loaders";
import { CONTENT } from '../../Content'
import Player from '../../UI/Player/Player'
import '../../UI/Player/Player.css';
import { OrbitControls } from 'three-full';
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
/* eslint import/no-webpack-loader-syntax: off */
import marchingCubeFragmentShader from '!raw-loader!glslify-loader!../../Shaders/hgSDF.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import simpleVertexShader from '!raw-loader!glslify-loader!../../Shaders/simpleVertex.glsl';

// import { notEqual } from 'assert';

const ANIMATION_CLIP_NAMES = CONSTANTS.animationClipNames;
const SPRITE_NAMES = CONSTANTS.spriteNames;
export default class Release0008_GreemJellyFish extends Component {
    state = {
        section: TRACK_SECTIONS[0.],
        videoActive: false,
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
            this.updateVideoTransform(prevState.section.location, section.location);
            // this.updateCameraTransform(section.location);
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
        this.camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 1500);
        // this.camera.position.set(3900, 600, 5800);
        this.camera.position.set(4, 1.2, -2.4);
        // this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        // // this.camera.position.set(3900, 600, 5800);
        // this.camera.position.set(0, 0, 15);
        // // this.camera.position.set(0, 1, 0);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        const manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(manager);
        this.textureLoader = new THREE.TextureLoader();
        // this.controls = new FirstPersonControls(this.camera)
        this.controls = new OrbitControls(this.camera)
        this.controls.target = new THREE.Vector3(4, 0, -5);//CONSTANTS.spriteStartPos[ALEXA]); 
        // TODO hack where should this happen/go
        // this.controls.target = new THREE.Vector3(CONSTANTS.spriteStartPos[ALEXA]);
        // this.camera.rotateY += -180
        //   this.camera.lookAt(new THREE.Vector3(CONSTANTS.spriteStartPos[ALEXA]));
        //    this.camera.position.set(3,  .5, -2)
        //    this.camera.rotation.set(-0.11992397372604029, 0.03307294393788508, 0.003984615119172061)
        this.camera.position.set(3.7664189221303097, 1.9469800595649362, 0.3746167505170739)
        this.camera.rotation.set(-0.1984665447828528, -0.06484084312275079, -0.013030532093610919)
        //  const FIRST_PERSON_CONTROL_SPEED = .1;
        //      const FIRST_PERSON_CONTROL_MOVEMENT = 10;
        //this.controls.lookSpeed = .05;
        //this.controls.movementSpeed = FIRST_PERSON_CONTROL_MOVEMENT;
        //this.controls.enabled = true;
        // this.controls.heightMin = .25;
        // this.controls.heightMax = .75;
        //this.controls.mouseMotionActive = false;//true;
        // this.controls = new OrbitControls(this.camera);
        // this.controls.lookSpeed = .1;
        // this.controls.movementSpeed = 10;
        // this.controls.enabled = true;
        // this.controls.mouseMotionActive = false;//true;
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
        this.initVid();
        this.initSprites();
        this.initOffice();
        this.initForest();
        this.initBlobs();
        this.initScene();
    }

    // TODO setup callback pattern on gltf loads rather than set interval...
    initScene() {
        const { locations } = this;
        const { section } = this.state;
        const refreshId = setInterval(() => {
            if (locations[section.location]) {
                locations[section.location].visible = true;
                // this.updateCameraTransform(section.location)

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



    initVid = () => {
        const refreshId = setInterval(() => {
            // the media is loaded by the player... this is in lieu of a proper callback behavior for the player.
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
                this.chromaMesh.scale.set(.3, .3, .3);
                // this.chromaMesh.position.set(0,0,0);
                // this.chromaMesh.rotation.set(0, 90, 0);
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

    initBlobs = () => {
        const { camera, clock, scene } = this;
        const numLights = 5;
        const width = numLights;
        const height = 1.;
        this.blobLightDataSize = width * height;
        this.blobLightPositionRadius = .7;
        this.blobLightPositionCenter = new THREE.Vector2(-.1, -.2)
        this.blobLightPositions = new Uint8Array(3 * this.blobLightDataSize);
        this.blobLightFall = new Uint8Array(3 * this.blobLightDataSize);
        this.blobLightCols = new Uint8Array(3 * this.blobLightDataSize)
        for (let i = 0; i < this.blobLightDataSize; i++) {
            const stride = i * 3;
            this.blobLightPositions[stride] = Math.floor(this.blobLightPositionCenter.x + this.blobLightPositionRadius * Math.cos(clock.getElapsedTime()) * 255);
            this.blobLightPositions[stride + 1] = Math.floor(this.blobLightPositionCenter.y + this.blobLightPositionRadius * Math.sin(clock.getElapsedTime()) * 255);
            this.blobLightPositions[stride + 2] = 0
            this.blobLightFall[stride] = Math.floor(0.5 * 255.);
            this.blobLightFall[stride + 1] = Math.floor(0.5 * 255.);
            this.blobLightFall[stride + 2] = Math.floor(Math.cos(clock.getElapsedTime()) * 255.)
            this.blobLightCols[stride] = Math.floor(.9 * 255)
            this.blobLightCols[stride + 1] = Math.floor(.1 * 255)
            this.blobLightCols[stride + 2] = 0
        }
        let sLightPos = new THREE.DataTexture(this.blobLightPositions, width, height, THREE.RGBFormat);
        sLightPos.needsUpdate = true;
        let sLightFall = new THREE.DataTexture(this.blobLightFall, width, height, THREE.RGBFormat);
        sLightFall.needsUpdate = true;
        let sLightCol = new THREE.DataTexture(this.blobLightCols, width, height, THREE.RGBFormat);
        sLightCol.needsUpdate = true; // TODO maybe not
        this.blobMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCamPos: { value: this.camera.position },
                uCamFov: { value: 1. },
                uLookAtPos: { value: new THREE.Vector3() },
                uNumLights: { type: 'i', value: 5 },
                sLightCol: { value: sLightCol }, //new THREE.Vector3(1, 1, 0) },
                sLightPos: { value: sLightPos }, // TODO update this on a sin wave
                sLightFall: { value: sLightFall },// new THREE.Vector3(0.5, 0.5, 0.2)}, // TODO update
                uBgColor: { value: new THREE.Vector3(0, 0, 0) },
                uTime: { value: clock.getDelta() },
                uDisplacementOffset: { type: 'f', value: 1.5 },
                uSp1: { value: new THREE.Vector3(0, 4, 9) },
                uSp2: { value: new THREE.Vector3(0, -4, 9) },
                uRadius: { value: 1.5 },
            },
            vertexShader: simpleVertexShader,
            fragmentShader: marchingCubeFragmentShader,
            transparent: true,
        });
        const geometry = new THREE.PlaneGeometry(10, 10, 4);
        const plane = new THREE.Mesh(geometry, this.blobMaterial);
        plane.visible = true;//false;
        plane.position.set(0, 0, -10)
        scene.add(plane);
        this.locations[FALLING] = plane;
    }

    initForest() {
        const { gltfLoader } = this;
        const name = "office";
        const gltfParams = {
            url: assetPath8('objects/blocky-rocks/waterfall.glb'),
            name: name,
            position: [0, 0, -15],
            rotateX: 0,
            rotateY: 0,
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
            position: CONSTANTS.spriteStartPos[ALEXA],
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
            position: CONSTANTS.spriteStartPos[REBECCA],
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
            position: CONSTANTS.spriteStartPos[DENNIS],
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

    updateBlobMateral() {
        const { blobMaterial, blobLightPositions, blobLightPositionRadius, blobLightCols, blobLightPositionCenter, blobLightDataSize, blobLightFall, sLightPos, clock } = this;
        const elapsedTime = clock.getElapsedTime()
        blobMaterial.uniforms.uTime.value = elapsedTime * .3;
        for (let i = 0; i < blobLightDataSize; i++) {
            const stride = blobLightDataSize * i;
            blobLightPositions[stride] = Math.floor((blobLightPositionCenter.x + blobLightPositionRadius * Math.cos(elapsedTime)) * 255)
            blobLightPositions[stride + 1] = Math.floor((blobLightPositionCenter.y + blobLightPositionRadius * Math.sin(elapsedTime)) * 255)
            blobLightPositions[stride + 2] = 100
            blobLightFall[stride] = Math.floor(.5 * 255);
            blobLightFall[stride + 1] = Math.floor(.5 * 255);
            blobLightFall[stride + 2] = Math.floor(Math.abs(Math.cos(elapsedTime + i)) * 255.);
            blobLightCols[stride] = 255. - (Math.random() * 50)
            blobLightCols[stride + 1] = 0.//Math.floor(Math.random() * 255)
            blobLightCols[stride + 2] = 0.//Math.floor(Math.random() * 255)
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

    transitionAnimation(spriteAnimation, nextClipName, fadeInTime) {
        const curClip = spriteAnimation.curClip;
        if (nextClipName != curClip.name) {
            // console.log("next clip", nextClipName, 'cur clikp', curClip.name)
            const nextClip = THREE.AnimationClip.findByName(spriteAnimation.clips, nextClipName);
            const curAction = spriteAnimation.mixer.clipAction(curClip)
            const nextAction = spriteAnimation.mixer.clipAction(nextClip);
            nextAction.enabled = true; // This needs to be set...
            nextAction.play()
            curAction.crossFadeTo(nextAction, fadeInTime);
            spriteAnimation.curClip = nextClip;
        }

    }

    updateSpriteAnimations() {
        const { section } = this.state;
        const { spriteAnimations, clock } = this;
        const clipNames = ANIMATION_CLIP_NAMES[section.location]; // clip names by location
        const currentTime = this.getVideoCurrentTime();
        const timeLeftInSection = section.end - currentTime;
        const proportionOfSectionCompleted = 1. - timeLeftInSection / parseFloat(section.length);
        const fadeInCutoff = .75;
        const fadeInTime = fadeInCutoff * section.length;
        for (const spriteName in spriteAnimations) {
            const spriteAnimation = spriteAnimations[spriteName];
            if (!spriteAnimation) continue; // TODO these is an onLoad/init issue...
            // just toggling between two animations per section...
            const clipName = clipNames[0];
            if (proportionOfSectionCompleted > fadeInCutoff && clipNames.length > 1) clipName = clipNames[1];
            this.transitionAnimation(spriteAnimation, clipName, fadeInTime)
            spriteAnimation.mixer.update(.1);//clock.getDelta());
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

    updateVideoTransform(prevLocation, curLocation) {
        const { locations, officeWall, waterFall, chromaMesh, chromaMaterial, clock } = this;
        if (!chromaMesh) return;
        locations[prevLocation].remove(chromaMesh)
        locations[curLocation].add(chromaMesh)
        chromaMesh.position.set(0, 0, 0);
        if (curLocation == OFFICE) {
            chromaMesh.position.y += 1;
            chromaMesh.position.x += 3.5;
            chromaMesh.position.z -= 9;
        }
    }

    updateCameraTransform(curLocation) {
        const { camera } = this;
        console.log("prev", curLocation)
        if (curLocation === OFFICE) {
            // console.log("SETTING POSITION")
            // camera.position.set(-4.5, 0, 0);
            // camera.rotation.set(180, 0, 0);
        }
    }

    updateVideo() {
        const { clock, chromaMaterial } = this;
        const { videoActive } = this.state
        if (!chromaMaterial) return;
        if (!videoActive) {
            // just set the video as active and in a location after it's been initialized for the first time
            this.updateVideoTransform(OFFICE, OFFICE);
            this.setState({ videoActive: true });
        }
        chromaMaterial.uniforms.u_time.value = clock.getElapsedTime();
    }

    updateTrackSectionState() {
        const { section } = this.state;
        const { locations } = this;
        const forest = locations[FOREST];
        const office = locations[OFFICE];
        if (!forest || !office) return; // onload...
        const currentTime = this.getVideoCurrentTime(); // returns 0 if chromaMesh undefined
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

    // anything that needs to change in an active section
    updateTrackSectionDeltas() {
        const { section } = this.state;
        const { blobMaterial } = this;
        if (section.location === FALLING) {
            this.updateBlobMateral();
        }
        if (section.location === FOREST) {
            this.updateWaterMaterials();
        }
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock } = this;
        // let lightIntensity = this.updateLights(); // TODO currently too computationally intensive
        this.updateSpriteAnimations();
        this.updateTrackSectionState();
        // TODO controls will lock, order matters here (updating control before updating video; not sure why)
        // controls.update(clock.getDelta());
        // console.log(this.camera.position, this.camera.rotation, this.controls)
        this.updateVideo()
        this.updateTrackSectionDeltas();
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