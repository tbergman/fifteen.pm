import * as THREE from 'three';
import { generateTileFormations } from './formations';
import { createInstance } from './instances';

// TODO maybe the material ref should be assigned to the incoming geometries array of objects
export function generateTileset({ surface, buildings, neighborhoods }) {
    const elementsByName = {};
    const instancesByName = {};
    // build up a lookup of each geometry by name
    buildings.geometries.forEach((geometry) => elementsByName[geometry.name] = []);
    // get centers for each formation
    // generate formations for all tiles
    const formations = generateTileFormations(surface, buildings.geometries, neighborhoods);
    // add each geometry instance from each tile formation to the elements by name look up
    Object.keys(formations).forEach((tId) => {
        formations[tId].forEach((element) => {
            elementsByName[element.geometry.name].push(element);
        });
    });
    // create an instance geometry for each geometry type that includes all locations on each formation for that geometry
    Object.keys(elementsByName).forEach((name) => {
        if (elementsByName[name].length) {
            instancesByName[name] = createInstance(elementsByName[name], buildings.materials[THREE.Math.randInt(0, buildings.materials.length - 1)]);
        }
    });
    return instancesByName;
}
