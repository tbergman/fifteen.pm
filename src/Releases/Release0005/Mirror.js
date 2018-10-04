import React, {Component} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";

class Release0005 extends Component {
    componentDidMount() {
        this.init();

        // When user resize window
        window.addEventListener("resize", this.onResize.bind(this), false);
        // When user move the mouse
        document.body.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this),
            false
        );
        this.renderScene();
        this.controls = new OrbitControls(this.camera);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    init = () => {
        // Define the speed of the tunnel
        this.speed = 0.02;

        // Store the position of the mouse
        // Default is center of the screen
        this.mouse = {
            position: new THREE.Vector2(0, 0),
            target: new THREE.Vector2(0, 0)
        };

        // Create a WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        // Set size of the renderer and its background color
        this.renderer.setSize(CONSTANTS.ww, CONSTANTS.wh);
        this.renderer.setClearColor(0xffffff);

        // Create a camera and move it along Z axis
        this.camera = new THREE.PerspectiveCamera(15, CONSTANTS.ww / CONSTANTS.wh, 0.01, 1000);
        this.camera.position.z = 0.35;

        // Create an empty scene and define a fog for it
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x222222, 0.6, 2.8);


        var light = new THREE.HemisphereLight( 0xffffbb, 0x887979, 0.9);
        this.scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
        this.scene.add( directionalLight );

        this.container.appendChild(this.renderer.domElement);
        this.createTunnelMesh();
    }

    render() {
        return (
        );
    }
}

export default Release0005;
