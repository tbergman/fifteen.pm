import React from 'react';
import { Buildings } from './buildings';
import { randomArrayVal } from '../../Utils/random';
import Road from './Road';

export const SkyCityTile = props => {
    // console.log('in sky city tiles', props)
    // const formation = props.tileResources
    // const tileObjectsByName = randomArrayVal(props.tileResources);
    return <group>
       
    </group>
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