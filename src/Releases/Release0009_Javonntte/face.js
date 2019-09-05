import React, { useEffect, useRef, useState } from 'react';
import { useRender, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { faceCentroid, getMiddle, triangleCentroid, triangleFromFace } from '../../Utils/geometry';
import { TypedArrayUtils } from 'three-full';//./three/examples/jsm/utils/TypedArrayUtils';
import { assetPath9 } from "./utils";

// we cut off the floating point to match with the kdTree model, which changes the exact value a bit
const tileId = (centroid) => [centroid.x.toFixed(3), centroid.y.toFixed(3), centroid.z.toFixed(3)].join("_");

function variateSphereFaceHeights({ sides, tiers, maxHeight, worldRadius, sphereGeometry }) {
    var vertexIndex;
    var vertexVector = new THREE.Vector3();
    var nextVertexVector = new THREE.Vector3();
    var firstVertexVector = new THREE.Vector3();
    var offset = new THREE.Vector3();
    var currentTier = 1;
    var lerpValue = 0.5;
    var heightValue;
    for (var j = 1; j < tiers - 2; j++) {
        currentTier = j;
        for (var i = 0; i < sides; i++) {
            vertexIndex = (currentTier * sides) + 1;
            vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
            if (j % 2 !== 0) {
                if (i == 0) {
                    firstVertexVector = vertexVector.clone();
                }
                nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
                if (i == sides - 1) {
                    nextVertexVector = firstVertexVector;
                }
                lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                vertexVector.lerp(nextVertexVector, lerpValue);
            }
            heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
            offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
            sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
        }
    }
    return sphereGeometry;
}


// TODO add back in
function hardLimitYFaces(centroid, radius) {
    // don't populate the tiny triangles on top of the sphere
    return Math.abs(centroid.y) < radius * .98 + Math.random() * .1;
}

function withinBoundary(boundary, centroid, radius, maxDistance = 4) {
    return boundary.distanceTo(centroid) < maxDistance && hardLimitYFaces(centroid, radius);
}

function initFaceTile(face, centroid, triangle) {
    return {
        id: tileId(centroid),
        centroid: centroid,
        normal: face.normal,
        triangle: triangle,
        hasRendered: false,
        visible: true,//false,
    }
}

function generateTiles(sphereGeometry, boundary) {
    const vertices = sphereGeometry.vertices;
    // const boundaryLimit = sphereGeometry.parameters.radius / 3; // TODO this is too big unless we do instancing
    const tiles = {}
    sphereGeometry.faces.forEach((face, index) => {
        const triangle = triangleFromFace(face, vertices);
        const centroid = faceCentroid(face, vertices);
        const tile = initFaceTile(face, centroid, triangle);
        if (withinBoundary(boundary, centroid)) tile.visible = true;
        // const tId = tileId(face);
        const tId = tileId(centroid);
        tiles[tId] = tile;
    })
    return tiles;
}

function bucketTiles(radius, tiles) {
    // 8 sections.
    //  (radius is divisible by 8...)
    const bucketedTiles = {};
    const sections = [];
    const sectionSize = 3; // (radius / 8)
    for (let y = 0; y < 8; y++) {
        const startYVal = y * sectionSize;
        const endYVal = startYVal + sectionSize;
        for (let z = 0; z < 8; z++) {
            const startZVal = z * sectionSize;
            const endZVal = startZVal + sectionSize;
            // positives and negatives
            sections.push(
                {
                    minY: startYVal,
                    maxY: endYVal,
                    minZ: startZVal,
                    maxZ: endZVal,
                },
                {
                    minY: -endYVal,
                    maxY: -startYVal,
                    minZ: -endZVal,
                    maxZ: -startZVal,
                },
                {
                    minY: startYVal,
                    maxY: endYVal,
                    minZ: -endZVal,
                    maxZ: -startZVal,
                },
                {
                    minY: -endYVal,
                    maxY: -startYVal,
                    minZ: startZVal,
                    maxZ: endZVal,
                }
            )
        }
    }
    for (let i = 0; i < sections.length; i++) {
        bucketedTiles[i] = [];
    }
    Object.values(tiles).forEach(tile => {
        sections.forEach((section, index) => {
            if (tile.centroid.x < section.maxY && tile.centroid.x >= section.minY &&
                tile.centroid.z < section.maxZ && tile.centroid.z >= section.minZ) {
                bucketedTiles[index].push(tile);
            }
        })
    })
    return [bucketedTiles, sections];
}

//create particles with buffer geometry
var distanceFunction = function (a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
};

// TODO could make this hook :/
function loadKDTree(tiles) {
    const amountOfParticles = Object.keys(tiles).length;
    const positions = new Float32Array(amountOfParticles * 3);
    const alphas = new Float32Array(amountOfParticles);
    Object.values(tiles).forEach((tile, idx) => {
        positions[idx * 3] = tile.centroid.x
        positions[idx * 3 + 1] = tile.centroid.y
        positions[idx * 3 + 2] = tile.centroid.z
        alphas[idx] = 1.0;

    })
    console.log('sanity check positions', positions[0], ',', positions[1], ',', positions[2])
    // creating the kdtree takes a lot of time to execute, in turn the nearest neighbour search will be much faster
    const kdTree = new TypedArrayUtils.Kdtree(positions, distanceFunction, 3);
    // console.log("built kdtree", kdTree);
    // const tId = tileId(new THREE.Vector3(-0.04061417281627655, 23.848224639892578, -2.4875426292419434));
    // console.log('test lookup after we know its built', tiles[tId])


    return [kdTree, alphas, positions];

}

function displayNearest(camera, alphas, position, kdTree, maxDistance, particleGeom, tileLookup) {
    const matchingTiles = [];
    // take the nearest 200 around them. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
    var positionsInRange = kdTree.nearest([position.x, position.y, position.z], 100, maxDistance);

    // We combine the nearest neighbour with a view frustum. Doesn't make sense if we change the sprites not in our view... well maybe it does. Whatever you want.
    var _frustum = new THREE.Frustum();
    var _projScreenMatrix = new THREE.Matrix4();

    _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromMatrix(_projScreenMatrix);

    for (var i = 0, il = positionsInRange.length; i < il; i++) {

        var kdNode = positionsInRange[i];

        var objectPoint = new THREE.Vector3().fromArray(kdNode[0].obj);

        if (_frustum.containsPoint(objectPoint)) {

            var objectIndex = kdNode[0].pos;

            // set the alpha according to distance
            alphas[objectIndex] = 1.0 / maxDistance * kdNode[1];

            // update the attribute
            particleGeom.attributes.alpha.needsUpdate = true;

            const tId = tileId(objectPoint);
            const tile = tileLookup[tId];
            // TODO some floating point issues where no match found occasionally
            if (tile) matchingTiles.push(tile);


        }

    }
    return matchingTiles;

}


const vertexShader = `
//uniform float zoom;

			attribute float alpha;

			varying float vAlpha;

			void main() {

				vAlpha = 1.0 - alpha;

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = 4.0 * ( 300.0 / -mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}
`
const fragmentShader = `
uniform sampler2D tex1;

			varying float vAlpha;

			void main() {

				gl_FragColor = texture2D( tex1, gl_PointCoord );
				gl_FragColor.r = ( 1.0 - gl_FragColor.r ) * vAlpha + gl_FragColor.r;

			}
`

// create the custom shader

var textureLoader = new THREE.TextureLoader();

var imagePreviewTexture = textureLoader.load(assetPath9('textures/crate.gif'));

imagePreviewTexture.minFilter = THREE.LinearMipMapLinearFilter;
imagePreviewTexture.magFilter = THREE.LinearFilter;


var pointShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tex1: { value: imagePreviewTexture },
        zoom: { value: 9.0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
});


// https://discourse.threejs.org/t/raycast-objects-that-arent-in-scene/6704/4 
// view-source:https://rawgit.com/pailhead/three.js/instancing-part2-200k-instanced/examples/webgl_interactive_cubes.html
// https://medium.com/@pailhead011/instancing-with-three-js-part-2-3be34ae83c57
export function TileGenerator({ radius, sides, tiers, tileComponent, geometries, startPos, maxHeight }) {
    const { camera, scene, raycaster } = useThree();
    const [lastUpdateTime, setLastUpdateTime] = useState(0);
    const section = useRef(0);
    // const [section.current, setCurrentSection] = useState(0);
    const bucketedTiles = useRef({});
    const sections = useRef([]);
    const boundary = useRef(new THREE.Vector3().copy(startPos));
    const prevBoundary = useRef(boundary.current.clone());
    const tilesGroup = useRef(new THREE.Group());
    const allTiles = useRef([]);
    const visibleTiles = useRef([]);
    const boundaryMax = 10;
    const maxDistance = Math.pow(120, 2); // for kdTree
    let sphereGeometry = new THREE.SphereGeometry(radius, sides, tiers);
    sphereGeometry = variateSphereFaceHeights({ sphereGeometry, radius, sides, tiers, maxHeight });
    const kdTree = useRef();
    const alphas = useRef([])
    const particleGeom = useRef(new THREE.BufferGeometry());
    const positions = useRef();
    const particles = useRef();
    const closestTiles = useRef([]);
    const cameraOffset = useRef(new THREE.Vector3());
    useEffect(() => {
        allTiles.current = generateTiles(sphereGeometry, startPos);
        console.log("ALL TILES", allTiles.current);
        // const tId = tileId(new THREE.Vector3(-1.2476178407669067, 23.9506778717041, -1.2168973684310913));
        // console.log('testid', tId);
        // const tIdalt = "-1.2476178407669067_23.9506778717041_-1.2168973684310913";
        // console.log('testid-alt', tIdalt);
        // console.log("test lookup", allTiles.current[tId])
        // console.log("test-alt lookup", allTiles.current[tIdalt])
        // const tId2 = "-1.2476178407669067_23.950677235921223_0.09818965196609497";
        // console.log("test lookup2", allTiles.current[tId2])
        visibleTiles.current = Object.values(allTiles.current).filter(tile => {
            if (withinBoundary(startPos, tile.centroid, radius, boundaryMax)) {
                tile.visible = true;
                return tile;
            }
        });
        [bucketedTiles.current, sections.current] = bucketTiles(radius, allTiles.current);
        // console.log("bucketed tiles", bucketedTiles.current)
        section.current = 0;
        [kdTree.current, alphas.current, positions.current] = loadKDTree(allTiles.current);
        particleGeom.current.addAttribute('position', new THREE.BufferAttribute(positions.current, 3));
        particleGeom.current.addAttribute('alpha', new THREE.BufferAttribute(alphas.current, 1));
        // particles.current = new THREE.Points( particleGeom, new THREE.MeshBasicMaterial() );
    }, [])


    useRender((state, time) => {
        const rotXDelta = .0001;
        tilesGroup.current.rotation.x += rotXDelta;
        const xRadiansRot = tilesGroup.current.rotation.x;
        // const zRadiansRot = camera.rotation.z;
        
        // // cameraOffset.current.subVectors(startPos, cameraOffset.current);
        
        // const curZOffset = Math.cos(xRadiansRot) * radius;
        // const curYOffset = Math.sin(xRadiansRot) * radius;
        // const curXOffset = Math.sin(zRadiansRot) * radius * 1.5;
        // // console.log(camera.rotation, camera.position);  
        // boundary.current.x = camera.position.x;//-curXOffset;
        // boundary.current.z = -curZOffset;
        // boundary.current.y = -curYOffset;
        boundary.current.copy(camera.position);
        // console.log('---');
        // console.log('offset', cameraOffset.current);
        // console.log('camera pos', camera.position);   
        // console.log('start pos', startPos); 
        // console.log('before offset', boundary.current)
        // boundary.current.addVectors(boundary.current, cameraOffset.current);
        // console.log('after offset', boundary.current)
        // let maxY, maxZ, minY, minZ;
        // TODO maybe this will just work with one dimension?
        // TODO bug... it's late
        // if (!section.current) section.current = 0;   
        // const previousSection = section.current;
        // for (let i = 0; i < sections.current.length; i++) {
        //     if (boundary.current.z < sections.current[i].maxZ &&
        //         boundary.current.z >= sections.current[i].minZ &&
        //         boundary.current.y < sections.current[i].maxY &&
        //         boundary.current.y >= sections.current[i].minY) {
        //         if (section.current !== i) {
        //             // bucketedTiles.current[previousSection].forEach(tile => {
        //             //     tile.visible = false;
        //             // }) // TODO fix turning off
        //             section.current = i;
        //             visibleTiles.current = bucketedTiles.current[section.current].map(tile => {
        //                 console.log("TLIE", tile);
        //                 if (tile.visible === true) tile.hasRendered = true;
        //                 else tile.visible = true;
        //                 return tile;
        //             });
        //             console.log('visible tiles', visibleTiles.current);
        //         }
        //         prevBoundary.current.copy(boundary.current);
        //     }
        // }
        // if (section.current !== previousSection) setLastUpdateTime(time);

        // if (prevBoundary.current.distanceTo(boundary.current) > .5) {
        //     setLastUpdateTime(time);
        //     visibleTiles.current = Object.values(allTiles.current).filter(tile => {
        //         // TODO this could all be calculated once rather than interated thru once it's working...
        //         // (just calculate different tile groups for each boundary in a map)
        //         if (withinBoundary(boundary.current, tile.centroid, radius, boundaryMax)) {
        //             if (tile.visible === true) tile.hasRendered = true;
        //             else tile.visible = true;
        //             return tile;
        //         } else {
        //             // TODO these are not going to get passed thru this is placeholder 
        //             allTiles.current[tile.id].visible = false;
        //         }
        //     })
        //     prevBoundary.current.copy(boundary.current);
        // }



        if (prevBoundary.current.distanceTo(boundary.current) > .5) {
            setLastUpdateTime(time);
            // camera, alphas, position, kdTree, maxDistance, particleGeom, tileLookup
            closestTiles.current = displayNearest(camera, alphas.current, boundary.current, kdTree.current, maxDistance, particleGeom.current, allTiles.current);
            prevBoundary.current.copy(boundary.current);
        }
    });

    // return <group ref={tilesGroup}>
    //     {visibleTiles.current && visibleTiles.current.map(props => {
    //         return <group key={props.id}>
    //             <MemoizedSphereTile
    //                 {...props}
    //                 buildingGeometries={geometries}
    //                 tileComponent={tileComponent}
    //                 tileId={props.id}
    //             />
    //         </group>
    //     })}
    // </group>
    // return <group ref={tilesGroup}>
    //     <points
    //         geometry={particleGeom.current}
    //         material={pointShaderMaterial}
    //     />
    // </group>
    return <group ref={tilesGroup}>
        {closestTiles.current && closestTiles.current.map(props => {
            return <group key={props.id}>
                <MemoizedSphereTile
                    {...props}
                    buildingGeometries={geometries}
                    tileComponent={tileComponent}
                    tileId={props.id}
                />
            </group>
        })}
    </group>
}


export const MemoizedSphereTile = React.memo(props => {
    if (!props.visible) return null; // TODO remove?
    return <>{props.tileComponent(props)}</>;
}, props => !props.hasRendered);

