import React from 'react';
import { Buildings } from './buildings';
import {randomArrayVal} from '../../Utils/random';

export const SkyCityTile = props => {
    console.log("props", props); //props.pos is determined by grid size and camera pos, props.id is tileId;
    // const formation = props.tileResources
    // const tileObjectsByName = randomArrayVal(props.tileResources);

    return Object.keys(props.tileResources).map(instanceName => {
        // console.log("THIS ISIT", instanceName, tileObjectsByName[instanceName])
        return <primitive key={instanceName}
            object={props.tileResources[instanceName]}
        />
    })
    // return <Buildings
    //         material={props.tileElements.buildings.material}
    //         formation={props.tileElements.formations[props.tileId]}
    //         normal={props.normal}
    //     />
}