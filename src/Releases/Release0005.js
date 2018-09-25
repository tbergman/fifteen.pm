import React, {Component} from 'react';
import './Release.css';
import * as THREE from "three";
import {OrbitControls} from "../Utils/OrbitControls";

// Get window dimension
const ww = document.documentElement.clientWidth || document.body.clientWidth;
const wh = window.innerHeight;

// Save half window dimension
const ww2 = ww * 0.5, wh2 = wh * 0.5;
const textures = {
    "galaxy": {
        url: "assets/galaxy.jpg"
    }
};

class Tunnel extends Component {
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

    componentWillUnmount() {

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
        this.renderer.setSize(ww, wh);
        this.renderer.setClearColor(0xffffff);

        // Create a camera and move it along Z axis
        this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 1000);
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

    createTunnelMesh = () => {
        var points = [];

        for (var i = 0; i < 5; i += 1) {
            points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
        }
        points[4].y = -0.06;

        this.curve = new THREE.CatmullRomCurve3(points);

        var geometry = new THREE.Geometry();
        geometry.vertices = this.curve.getPoints(70);
        this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

        var loader = new THREE.TextureLoader();

        textures.galaxy.texture = loader.load(textures.galaxy.url, function(texture) {
            return texture;
        });

        this.tubeMaterial = new THREE.MeshStandardMaterial({
            side: THREE.BackSide,
            map: textures.galaxy.texture
        });

        this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
        this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;

        this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false);
        this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
        this.scene.add(this.tubeMesh);

        // original tube geometry
        this.tubeGeometry_o = this.tubeGeometry.clone();
    };

    onMouseMove = (e) => {
        // Save mouse X & Y position
        this.mouse.target.x = (e.clientX - ww2) / ww2;
        this.mouse.target.y = (wh2 - e.clientY) / wh2;
    };

    onResize = () => {
        // On resize, get new width & height of window
        const ww = document.documentElement.clientWidth || document.body.clientWidth;
        const wh = window.innerHeight;
        const ww2 = ww * 0.5;
        const wh2 = wh * 0.5;

        // Update camera aspect
        this.camera.aspect = ww / wh;
        // Reset aspect of the camera
        this.camera.updateProjectionMatrix();
        // Update size of the canvas
        this.renderer.setSize(ww, wh);
    };

    updateMaterialOffset = () => {
        // Update the offset of the material
        this.tubeMaterial.map.offset.x += this.speed * 0.5;
    };

    updateCurve = () => {
        var index = 0, vertice_o = null, vertice = null;
        // For each vertice of the tube, move it a bit based on the spline
        for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
            // Get the original tube vertice
            vertice_o = this.tubeGeometry_o.vertices[i];
            // Get the visible tube vertice
            vertice = this.tubeGeometry.vertices[i];
            // Calculate index of the vertice based on the Z axis
            // The tube is made of 50 rings of vertices
            index = Math.floor(i / 50);
            // Update tube vertice
            vertice.x +=
                (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) /
                10;
            vertice.y +=
                (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) /
                5;
        }
        // Warn ThreeJs that the points have changed
        this.tubeGeometry.verticesNeedUpdate = true;

        // Update the points along the curve base on mouse position
        this.curve.points[2].x = -this.mouse.position.x * 0.1;
        this.curve.points[4].x = -this.mouse.position.x * 0.1;
        this.curve.points[2].y = this.mouse.position.y * 0.1;

        // Warn ThreeJs that the spline has changed
        this.splineMesh.geometry.verticesNeedUpdate = true;
        this.splineMesh.geometry.vertices = this.curve.getPoints(70);
    };

    updateCameraPosition = () => {
        // Update the mouse position with some lerp
        this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
        this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

        // Rotate Z & Y axis
        this.camera.rotation.z = this.mouse.position.x * 0.2;
        this.camera.rotation.y = Math.PI - this.mouse.position.x * 0.06;
        // Move a bit the camera horizontally & vertically
        this.camera.position.x = this.mouse.position.x * 0.015;
        this.camera.position.y = -this.mouse.position.y * 0.015;
    };

    renderScene = () => {
        // Update material offset

        this.updateMaterialOffset();

        // Update camera position & rotation
        this.updateCameraPosition();

        // Update the tunnel
        this.updateCurve();

        // render the scene
        this.renderer.render(this.scene, this.camera);

        // Animation loop
        window.requestAnimationFrame(this.renderScene.bind(this));
    }

    render() {
        return (
            <div ref={element => this.container = element}/>
        );
    }
}

export default Tunnel;
