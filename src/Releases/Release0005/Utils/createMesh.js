import * as THREE from "three";
import {CONSTANTS} from "../constants";

export const createTunnelMesh = () => {
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