import React, {Component} from 'react';
import '../Release.css';
import * as THREE from "three";
import {OrbitControls} from "../../Utils/OrbitControls";
import {CONSTANTS} from "./constants";
import {Reflector} from '../../Utils/Reflector';

class Release0005 extends Component {
    componentDidMount() {
        this.init();

        // When user resize window
        window.addEventListener("resize", this.onResize, false);
        // When user move the mouse
        document.body.addEventListener(
            "mousemove",
            this.onMouseMove,
            false
        );
        this.renderScene();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 400;
        this.controls.minDistance = 10;
        this.controls.target.set( 0, 40, 0);
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
        this.renderer.setPixelRatio( window.devicePixelRatio );

        // Create a camera and move it along Z axis
        // params: (view_angle, aspect, near, far)
        this.camera = new THREE.PerspectiveCamera(45, CONSTANTS.ww / CONSTANTS.wh, 1, 500);
        this.camera.position.set( 0, 75, 160 );

        // this.camera.position.z = 0.35;
        // this.camera.position.x = -100;
        //this.camera.position.set( 0, 75, 160 );


        // Create an empty scene and define a fog for it
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x222222, 0.6, 2.8);

        this.createMirror();
        this.createWalls();
        this.createLights();
        // var light = new THREE.HemisphereLight( 0xffffbb, 0x887979, 0.9);
        // this.scene.add( light );
        //
        // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
        // this.scene.add( directionalLight );

        this.container.appendChild(this.renderer.domElement);
        // this.createTunnelMesh();
    }

    createLights() {
        var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
        mainLight.position.y = 0;
        this.scene.add( mainLight );

        var pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
        pointLight.position.x = 30;
        pointLight.position.y = 30;
        pointLight.position.z = 0;
        this.scene.add(pointLight);

        var greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 );
        greenLight.position.set( 50, 50, 0 );
        this.scene.add( greenLight );

        var redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
        redLight.position.set( - 50, 50, 0 );
        this.scene.add( redLight );

        var blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
        blueLight.position.set( 0, 50, 50 );
        this.scene.add( blueLight );
    }

    createWalls() {
        var planeGeo = new THREE.PlaneBufferGeometry( 100.1, 100.1 );
        // planeGeo.verticesNeedUpdate = true;
        // planeGeo.normalsNeedUpdate = true;
        // planeGeo.computeVertexNormals();
        // planeGeo.computeFaceNormals();
        // // planeGeo.normalizeNormals();

        // walls
        var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshBasicMaterial( { color: 0xffffff,    shading: THREE.FlatShading,
        } ) );
        planeTop.position.y = 100;
        planeTop.rotateX( Math.PI / 2 );
        this.scene.add( planeTop);

        var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff,    shading: THREE.FlatShading,
        } ) );
        planeBottom.rotateX( - Math.PI / 2 );
        this.scene.add( planeBottom);

        var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff,    shading: THREE.FlatShading,
        } ) );
        planeFront.position.z = 50;
        planeFront.position.y = 50;
        planeFront.rotateY( Math.PI );
        this.scene.add( planeFront);

        var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00,    shading: THREE.FlatShading,
        } ) );
        planeRight.position.x = 50;
        planeRight.position.y = 50;
        planeRight.rotateY( - Math.PI / 2 );
        this.scene.add( planeRight);

        var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000,    shading: THREE.FlatShading,
        } ) );
        planeLeft.position.x = -50;
        planeLeft.position.y = 50;
        planeLeft.rotateY( Math.PI / 2 );
        console.log(planeLeft);
        this.scene.add( planeLeft);
    }

    createMirror() {
        const mirrorGeometry = new THREE.CircleBufferGeometry( 40, 64 );
        const mirror = new Reflector( mirrorGeometry, {
            // clipBias: 0.003,
            textureWidth: CONSTANTS.ww * window.devicePixelRatio,
            textureHeight: CONSTANTS.wh * window.devicePixelRatio,
            color: 0xffffff,
            recursion: 1
        });
        mirror.position.y = 0;
        mirror.rotateY( - Math.PI / 2 );

        this.mirror = mirror;
        // this.scene.add( this.mirror );

        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        var verticalMirror = new Reflector( geometry, {
            // clipBias: 0.003,
            textureWidth: CONSTANTS.ww * window.devicePixelRatio,
            textureHeight: CONSTANTS.wh * window.devicePixelRatio,
            color: 0x889999,
            recursion: 1
        } );
        verticalMirror.position.y = 50;
        verticalMirror.position.z = - 50;
        // this.scene.add( verticalMirror );

    }

    createTunnelMesh() {
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

        var textures = loader.load(CONSTANTS.textures.galaxy.url, function(texture) {
            return texture;
        });

        this.tubeMaterial = new THREE.MeshStandardMaterial({
            side: THREE.BackSide,
            map: textures
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
        this.mouse.target.x = (e.clientX - (CONSTANTS.ww * 0.5)) / (CONSTANTS.ww * 0.5);
        this.mouse.target.y = ((CONSTANTS.wh * 0.5) - e.clientY) / (CONSTANTS.wh * 0.5);
    };

    onResize = () => {
        // On resize, get new width & height of window
        const ww = document.documentElement.clientWidth || document.body.clientWidth;
        const wh = window.innerHeight;

        // Update camera aspect
        this.camera.aspect = ww / wh;
        // Reset aspect of the camera
        this.camera.updateProjectionMatrix();
        // Update size of the canvas
        this.renderer.setSize(ww, wh);
    };

    updateMaterialOffset() {
        // Update the offset of the material
        this.tubeMaterial.map.offset.x += this.speed * 0.5;
    };

    updateCurve() {
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

    updateCameraPosition() {
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

    renderScene() {
        // Update material offset

        // this.updateMaterialOffset();

        // Update camera position & rotation
        // this.updateCameraPosition();

        // Update the tunnel
        // this.updateCurve();

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

export default Release0005;
