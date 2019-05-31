import React, { Component, Fragment } from 'react';
import * as THREE from "three";
import debounce from 'lodash/debounce';
import '../Release.css';
import { isIE } from "../../Utils/BrowserDetection.js";
import { loadGLTF } from "../../Utils/Loaders";
import { Water2 } from "../../Utils/Water2"
import { CONTENT } from '../../Content'
import Menu from '../../UI/Menu/Menu';
import '../../UI/Player/Player.css';
import { OrbitControls } from 'three-full';
import GLTFLoader from 'three-gltf-loader';
import {
    OFFICE,
    FALLING,
    FOREST,
    REBECCA,
    ALEXA,
    DENNIS,
    TRACK_SECTIONS,
    ORBIT,
    STILL,
    CONSTANTS,
} from "./constants.js";
import { assetPath8 } from "./utils.js";
import { initFoamGripMaterial, initRockMaterial, initTransluscentMaterial, initPinkShinyMaterial } from "./materials.js";

/* eslint import/no-webpack-loader-syntax: off */
import chromaVertexShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyVertex.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import chromaFragmentShader from '!raw-loader!glslify-loader!../../Shaders/chromaKeyFragment.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import marchingCubeFragmentShader from '!raw-loader!glslify-loader!../../Shaders/hgSDF.glsl';
/* eslint import/no-webpack-loader-syntax: off */
import simpleVertexShader from '!raw-loader!glslify-loader!../../Shaders/simpleVertex.glsl';

const ANIMATION_CLIP_NAMES = CONSTANTS.animationClipNames;

export default class Release0008_GreemJellyFish extends Component {
    state = {
        section: TRACK_SECTIONS[0.],
    }

    componentDidMount() {
        this.init();
        //window.addEventListener('mousemove', this.onDocumentMouseMove, false);
        //window.addEventListener("touchstart", this.onDocumentMouseMove, false);
        //window.addEventListener("touchmove", this.onDocumentMouseMove, false);
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
        this.camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, .1, 1500);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(this.camera);
        const manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(manager);
        this.textureLoader = new THREE.TextureLoader();
        this.controls = new OrbitControls(this.camera)
        this.clock = new THREE.Clock();
        // release-specific objects
        this.sprites = [];
        this.materials = {}
        this.spriteAnimations = {};
        this.videoParents = {};
        this.locations = {
            FOREST: [],
            OFFICE: [],
            FALLING: []
        }
        // release-specific initilization
        this.initMaterials();
        this.initLights();
        this.initVideo();
        this.initSprites();
        this.initOffice();
        this.initForest();
        this.initBlobs();
        this.initScene();
        this.muteMainAudio();
    }

    // TODO setup callback pattern on gltf loads rather than set interval...
    initScene = () => {
        const { locations } = this;
        const { section } = this.state;
        const refreshId = setInterval(() => {
            if (locations[section.location].length) {
                this.setVisible(section.location);
                this.updateCameraTransform();
                clearInterval(refreshId);
            }
        }, 100);
    }

    initMaterials() {
        const { materials, textureLoader, renderer } = this;
        materials.rock = initRockMaterial(textureLoader);
        materials.foam = initFoamGripMaterial(textureLoader);
        materials.pinkShiny = initPinkShinyMaterial();
        materials.transluscent = initTransluscentMaterial(.25);
    }

    initVideo = () => {
        const refreshId = setInterval(() => {
            // the media is loaded by the player... this is in lieu of a proper callback behavior for the player.
            if (CONSTANTS.auxMedia[0].media) { // greem video
                let videoMesh = CONSTANTS.auxMedia[0].mesh;
                this.chromaMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        u_time: { type: 'f', value: 0.0 },
                        iChannel0: { value: videoMesh.material.map }
                    },
                    vertexShader: chromaVertexShader,
                    fragmentShader: chromaFragmentShader,
                    transparent: true,
                    side: THREE.DoubleSide,
                    needsUpdate: true,
                    skinning: true
                });
                let chromaPlane = new THREE.PlaneBufferGeometry(16, 9);
                this.chromaMesh = new THREE.Mesh(chromaPlane, this.chromaMaterial);
                this.setVideoTransform();
                clearInterval(refreshId);
            }
        }, 100);
    }

    initLights = () => {
        const { scene, camera } = this;
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    }

    initBlobs = () => {
        const { camera, locations, videoParents, clock, scene } = this;
        const numLights = 5;
        const width = numLights;
        const height = 1.;
        this.blobLightDataSize = width * height;
        this.blobLightPositionRadius = .7;
        this.blobLightPositionCenter = new THREE.Vector2(-.1, -.2)
        this.blobLightPositions = new Uint8Array(3 * this.blobLightDataSize);
        this.blobLightFall = new Uint8Array(3 * this.blobLightDataSize);
        this.blobLightCols = new Uint8Array(3 * this.blobLightDataSize)
        this.blobSphere1Center = new THREE.Vector3(0, 4, 0);
        this.blobSphere2Center = new THREE.Vector3(0, -4, 0);
        for (let i = 0; i < this.blobLightDataSize; i++) {
            const stride = i * 3;
            this.blobLightPositions[stride] = Math.floor(this.blobLightPositionCenter.x + this.blobLightPositionRadius * Math.cos(clock.getElapsedTime()) * 255);
            this.blobLightPositions[stride + 1] = Math.floor(this.blobLightPositionCenter.y + this.blobLightPositionRadius * Math.sin(clock.getElapsedTime()) * 255);
            this.blobLightPositions[stride + 2] = 100;
            this.blobLightFall[stride] = Math.floor(0.5 * 255.);
            this.blobLightFall[stride + 1] = Math.floor(0.5 * 255.);
            this.blobLightFall[stride + 2] = Math.floor(Math.cos(clock.getElapsedTime()) * 255.);
            this.blobLightCols[stride] = Math.floor(.9 * 255);
            this.blobLightCols[stride + 1] = Math.floor(.1 * 255);
            this.blobLightCols[stride + 2] = Math.floor(.0 * 255);
        }
        let sLightPos = new THREE.DataTexture(this.blobLightPositions, width, height, THREE.RGBFormat);
        sLightPos.needsUpdate = true;
        let sLightFall = new THREE.DataTexture(this.blobLightFall, width, height, THREE.RGBFormat);
        sLightFall.needsUpdate = true;
        let sLightCol = new THREE.DataTexture(this.blobLightCols, width, height, THREE.RGBFormat);
        sLightCol.needsUpdate = true;
        this.blobMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCamPos: { value: this.camera.position },
                uCamFov: { value: 45. }, // TODO ?
                uLookAtPos: { value: new THREE.Vector3(0, 0, 0) }, // CONSTANTS.spriteStartPos[ALEXA]); 
                uNumLights: { type: 'i', value: 5 },
                sLightCol: { value: sLightCol },
                sLightPos: { value: sLightPos },
                sLightFall: { value: sLightFall },
                uBgColor: { value: new THREE.Vector3(1., 15. / 255., 1) },
                uTime: { value: 0 },
                uDisplacementOffset: { type: 'f', value: .5 },
                uSp1: { value: this.blobSphere1Center },
                uSp2: { value: this.blobSphere2Center },
                uRadius: { value: 1.5 },
            },
            vertexShader: simpleVertexShader,
            fragmentShader: marchingCubeFragmentShader,
            transparent: true,
        });
        const geometry = new THREE.PlaneGeometry(16, 9, 1);
        const plane = new THREE.Mesh(geometry, this.blobMaterial);
        plane.visible = false;
        plane.position.set(0, 0, -8)
        scene.add(plane);
        locations[FALLING].push(plane);
    }

    initForest() {
        const { gltfLoader, locations, scene, videoParents, materials } = this;
        const name = "forest";
        // add rocks
        const gltfParams = {
            url: assetPath8('objects/waterfall/rocks.glb'),
            name: name,
            position: [1, 0, -10],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,//.05,
            loader: gltfLoader,
            onSuccess: (gltf) => {
                const { scene, textureLoader } = this;
                const object = gltf.scene.getObjectByProperty('mesh');
                object.traverse(function (node) {
                    if (node.name.includes("rock")) {
                        node.material = materials.rock;
                    }
                });
                const rocks = gltf.scene;
                rocks.visible = false;
                scene.add(rocks);
                //  this.waterFall = waterPlane;
                locations[FOREST].push(rocks);
            }
        }
        loadGLTF({ ...gltfParams });
        // add water
        const params = {
            color: '#ffffff',
            scale: 4,
            flowX: 1,
            flowY: 1
        };
        const waterGeometry = new THREE.PlaneBufferGeometry(50, 50);
        const water = new Water2(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY),
            textureWidth: 512,
            textureHeight: 512
        });
        water.position.y = .1;
        water.rotation.x = Math.PI * -0.5;
        water.visible = false
        scene.add(water);
        locations[FOREST].push(water);
        var riverBottomGeometry = new THREE.PlaneBufferGeometry(16, 9);
        var riverBottomMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0. });
        var riverBottom = new THREE.Mesh(riverBottomGeometry, riverBottomMaterial);
        riverBottom.position.z -= 5;
        riverBottom.rotation.x = Math.PI * - 0.5;
        riverBottom.visible = false
        scene.add(riverBottom);
        locations[FOREST].push(riverBottom)
        videoParents[FOREST] = riverBottom;
    }

    initOffice = () => {
        const { gltfLoader, videoParents, locations, materials } = this;
        const name = "office";
        const gltfParams = {
            url: assetPath8('objects/office/scene.gltf'),
            name: name,
            position: [-4, 0, 5],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: (gltf) => {
                const { scene } = this;
                const object = gltf.scene.children[0].getObjectByProperty('mesh');
                if (object) {
                    object.traverse(function (node) {
                        if (node.name.includes('furniture')) {
                            node.material = materials.transluscent;
                        } else {
                            node.material = materials.pinkShiny;
                        }
                    });
                }
                const office = gltf.scene;
                office.visible = false;
                scene.add(office);
                videoParents[OFFICE] = office.getObjectByName("walls005_11");
                locations[OFFICE].push(office);
            }
        }
        loadGLTF({ ...gltfParams });
    }

    initSprites = () => {
        const { gltfLoader } = this;
        const alexaParams = {
            url: assetPath8("objects/alexa/alexa.glb"),
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
        const { scene, sprites, spriteAnimations } = this;
        // store sprites for updates
        // set material of first section
        sprites.push(gltf.scene);
        this.updateSpriteMaterial(section.location)
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
        const firstAction = spriteAnimations[gltf.name].mixer.clipAction(firstClip)
        firstAction.enabled = true;
        firstAction.play();
    }

    muteMainAudio() {
        const { mediaElement } = this;
        const refreshId = setInterval(() => {
            if (mediaElement) {
                if (isIE) {
                    mediaElement.volume = 0;
                } else {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioCtx.createMediaElementSource(mediaElement);
                    const gainNode = audioCtx.createGain();
                    gainNode.gain.value = 0;
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                }
                clearInterval(refreshId);
            }
        }, 100);
    }

    animate = () => {
        setTimeout(() => {
            this.frameId = window.requestAnimationFrame(this.animate);
        }, 1000 / 30);
        this.renderScene();
    }

    updateLocation(prevLocation, curLocation) {
        this.updateLocationVisibility(prevLocation, curLocation);
        this.updateVideoTransform(prevLocation, curLocation);
        this.updateSpriteMaterial(curLocation);
        this.updateCameraTransform();
    }

    setVisible(location) {
        const { locations } = this;
        for (let i = 0; i < locations[location].length; i++) {
            locations[location][i].visible = true;
        }
    }

    setInvisible(location) {
        const { locations } = this;
        for (let i = 0; i < locations[location].length; i++) {
            locations[location][i].visible = false;
        }
    }

    updateLocationVisibility(prevLocation, curLocation) {
        this.setVisible(curLocation);
        this.setInvisible(prevLocation);
    }

    updateBlobMateral() {
        const { blobMaterial, blobSphere1Center, blobSphere2Center, blobLightPositions, blobLightPositionRadius, blobLightCols, blobLightPositionCenter, blobLightDataSize, blobLightFall, sLightPos, clock } = this;
        const elapsedTime = clock.getElapsedTime()
        blobMaterial.uniforms.uTime.value = elapsedTime * .1;
        blobSphere1Center.y += .04;
        if (blobSphere1Center.y > 7) {
            blobSphere1Center.y = -7;
        }
        blobSphere2Center.y += .03;
        if (blobSphere2Center.y > 7) {
            blobSphere2Center.y = -7;
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
        const fadeInCutoff = CONSTANTS.animationFadeInRatio;
        const fadeInTime = fadeInCutoff * section.length;
        for (const spriteName in spriteAnimations) {
            const spriteAnimation = spriteAnimations[spriteName];
            if (!spriteAnimation) continue; // TODO these is an onLoad/init issue...
            // just toggling between two animations per section...
            const clipName = clipNames[0];
            if (proportionOfSectionCompleted > fadeInCutoff && clipNames.length > 1) clipName = clipNames[1];
            this.transitionAnimation(spriteAnimation, clipName, fadeInTime)
            spriteAnimation.mixer.update(CONSTANTS.animationSpeed[section.location]);//clock.getDelta());
        }
    }

    getVideoCurrentTime() {
        const { chromaMesh } = this;
        if (!chromaMesh) return 0;
        return chromaMesh.material.uniforms.iChannel0.value.image.currentTime;
    }

    setVideoTransform() {
        const { videoParents, chromaMesh } = this;
        const { section } = this.state;
        videoParents[section.location].add(chromaMesh);
        const transform = CONSTANTS.videoTransforms[section.location]
        const pos = transform.position;
        const rot = transform.rotation;
        const scale = transform.scale;
        chromaMesh.position.set(pos.x, pos.y, pos.z);
        chromaMesh.rotation.set(rot.x, rot.y, rot.z);
        chromaMesh.scale.set(scale.x, scale.y, scale.z);
    }

    /**
     *  Called whenever section changes state 
     */
    updateVideoTransform(prevLocation, curLocation) {
        const { videoParents, chromaMesh } = this;
        if (!chromaMesh) return;
        if (curLocation in videoParents) this.setVideoTransform();
        if (prevLocation in videoParents) videoParents[prevLocation].remove(chromaMesh);
    }

    /**
     * Called whenever section changes state (which can be the same location with new camera info.)
     */
    updateCameraTransform() {
        const { camera, clock, scene, controls } = this;
        const { section } = this.state;
        const cameraInfo = section.camera;
        if (cameraInfo.type === ORBIT) {
            const offset = cameraInfo.offset;
            const rotationSpeed = cameraInfo.speed;
            const lookAt = cameraInfo.lookAt;
            camera.position.x = Math.cos(clock.getElapsedTime() * rotationSpeed.x) * offset.x;// * 3; // TODO looks cools as close up
            camera.position.z = Math.sin(clock.getElapsedTime() * rotationSpeed.z) * offset.z; //  TODO looks cools as close up
            camera.position.y = offset.y;
            camera.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
        } else if (cameraInfo.type === STILL) {
            const pos = cameraInfo.position;
            const rot = cameraInfo.rotation;
            camera.position.set(pos.x, pos.y, pos.z);
            camera.rotation.set(rot.x, rot.y, rot.z);
            camera.lookAt(scene.position);
        }
    }

    updateVideo() {
        const { clock, chromaMaterial } = this;
        if (!chromaMaterial) return;
        chromaMaterial.uniforms.u_time.value = clock.getElapsedTime();
    }

    updateTrackSectionState() {
        const { section } = this.state;
        const { locations } = this;
        const forestElements = locations[FOREST];
        const officeElements = locations[OFFICE];
        if (!forestElements || !officeElements) return; // onload...
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
        const { controls, clock } = this;
        const { section } = this.state;
        if (section.location === FALLING) {
            this.updateBlobMateral();
        }
        if (section.location === FOREST) {
            this.updateVideo()
            this.updateCameraTransform()
        }
        if (section.location === OFFICE) {
            this.updateVideo()
            this.updateCameraTransform()
        }
    }

    updateSpriteMaterial(location) {
        const { sprites, materials } = this;
        for (let i = 0; i < sprites.length; i++) {
            const object = sprites[i].children[0].getObjectByProperty('mesh');
            if (object) {
                object.traverse(function (node) {
                    node.material = materials[CONSTANTS.trackSectionSpriteMaterialLookup[location]];
                });
            }
        }
    }

    renderScene = () => {
        const { renderer, scene, camera, controls, clock } = this;
        this.updateSpriteAnimations();
        this.updateTrackSectionState();
        this.updateTrackSectionDeltas();
        renderer.render(scene, camera);
    }

    render() {
        return (
            <Fragment>
                <Menu
                    content={CONTENT[window.location.pathname]}
                    menuIconFillColor={CONTENT[window.location.pathname].theme.iconColor}
                    mediaRef={el => this.mediaElement = el}
                    auxMedia={CONSTANTS.auxMedia}
                />
                <div className="release">
                    <div ref={(element) => this.container = element} />
                </div>
            </Fragment>
        );
    }
}