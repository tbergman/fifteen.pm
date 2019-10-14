import React from 'react';
import { useThree } from 'react-three-fiber';
import { Buildings } from './buildings';
import { randomArrayVal } from '../../Utils/random';
import Road from './Road';


// function isClose(points, pos) {
//     points.forEach(point =>{
//         console.log(point.distanceTo(pos));
//     })
//     return points.filter(point => point.distanceTo(pos) < 100).length > 0;
// }

export const SkyCityTile = props => {
    const { camera } = useThree();
    // console.log('in sky city tiles', props)
    // const formation = props.tileResources
    // const tileObjectsByName = randomArrayVal(props.tileResources);
    // console.log('in the tiles', props.pos, camera.position, )
    const spacedPoints = props.road.getSpacedPoints(2000);
    const boxPos = props.pos;
    boxPos.y = camera.position.y
    const tooClose = isClose(spacedPoints, boxPos);
    console.log("TOO CLOSE", tooClose);
    return !tooClose ?
        <mesh
            position={boxPos}
        >
            <boxGeometry attach="geometry" />
        </mesh > : null

}
    // return Object.keys(props.tileResources).map(instanceName => {
            //     // console.log("THIS ISIT", instanceName, tileObjectsByName[instanceName])
            //     return <primitive key={instanceName}
            //         object={props.tileResources[instanceName]}
            //     />
            // })
            // return <Buildings
            //         material={props.tileElements.buildings.material}
            //         formation={props.tileElements.formations[props.tileId]}
            //         normal={props.normal}
            //     />
        // }


        //{React.cloneElement(props.children, { ...props })}

        // Vector3[] vertices = mesh.vertices;
        // for (int v = 0; v < vertices.Length; v++)
        // {
        //     vertices[v].y = Mathf.PerlinNoise(
        //     (vertices[v].x + this.transform.position.x) / detailScale,
        //     (vertices[v].z + this.transform.position.z) / detailScale) * heightScale;
        // }
        // mesh.vertices = vertices;
        // mesh.RecalculateBounds();
        // mesh.RecalculateNormals();
        // this.gameObject.AddComponent<MeshCollider>();