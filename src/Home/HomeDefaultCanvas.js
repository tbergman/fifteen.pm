import React, { PureComponent } from 'react';
import * as THREE from 'three';
import '../Releases/Release.css';
import debounce from 'lodash/debounce';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loadGLTF } from '../Common/Utils/LegacyLoaders';
import { assetPath } from "../Common/Utils/assets";
import { OrbitControls } from 'three-full';
import { initRockMaterial } from '../Common/Materials/legacyMaterials.js';
import { Water } from 'three/examples/jsm/objects/Water2';

export class HomeDefaultCanvas extends PureComponent {

    // export function HomeDefaultCanvas(props){
    state = {
        overlayOpen: false,
    }

    componentDidMount() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFF0FFF);
        this.camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(2.095357312111118, 0.8505415314262585, 11.67921580831209);
        this.camera.rotation.set(-0.042438732895147505, 0.3365395324927288, 0.01402173472318894);
        this.camera.lookAt(new THREE.Vector3());
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', this.onWindowResize, false);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.init();
        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize, false);
        this.container.removeChild(this.renderer.domElement);
    }
    onWindowResize = debounce(() => {
        const { camera, renderer } = this;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 50);


    init = () => {
        this.container.appendChild(this.renderer.domElement);
        this.initForest();
        this.initLights();
    }

    initLights = () => {
        const { scene } = this;
        const ambientLight = new THREE.AmbientLight(0xFF0FFF);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    }

    initForest() {
        const { scene, materials } = this;
        const manager = new THREE.LoadingManager();
        const gltfLoader = new GLTFLoader(manager);
        const textureLoader = new THREE.TextureLoader();
        const rockMaterial = initRockMaterial(textureLoader, 0xFFAFFF, {displacementScale: 1.5});
        rockMaterial.displacementBias = -30;
        const name = "forest";
        // add rocks
        const gltfParams = {
            url: assetPath('8/objects/waterfall/rocks.glb'),
            name: name,
            position: [1, 0, -10],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            relativeScale: 1,
            loader: gltfLoader,
            onSuccess: (gltf) => {
                const { scene, textureLoader } = this;
                const object = gltf.scene.getObjectByProperty('mesh');
                object.traverse(function (node) {
                    if (node.name.includes("rock")) {
                        node.material = rockMaterial;
                        node.material.needsUpdate = false;
                    }
                });
                const rocks = gltf.scene;
                scene.add(rocks);
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
        const waterGeometry = new THREE.PlaneBufferGeometry(20, 20);
        const water = new Water(waterGeometry, {
            color: params.color,
            scale: params.scale,
            flowDirection: new THREE.Vector2(params.flowX, params.flowY).normalize(),
            textureWidth: 512,
            textureHeight: 512,
            normalMap0: textureLoader.load('assets/shared/images/water/textures/water/Water_1_M_Normal.jpg'),
            normalMap1: textureLoader.load('assets/shared/images/water/textures/water/Water_2_M_Normal.jpg'),
        });
        water.position.y = .1;
        water.rotation.x = Math.PI * -0.5;
        scene.add(water);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderScene();
    }

    renderScene = () => {
        const { renderer, camera, scene } = this;
        // this.renderCursorStyle();
        // this.renderReleaseLinks();
        renderer.render(scene, camera);
    }

    render() {
        return <>
            <div className="release" ref={element => this.container = element} />
        </>
    }
}