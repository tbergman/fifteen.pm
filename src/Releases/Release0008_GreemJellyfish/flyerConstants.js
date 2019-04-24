import * as THREE from "three";

import {multiSourceVideo} from '../../Utils/Video/paths.js'
// const multiSourceVideo = (path) => ([
//     { type: 'video/mp4', src: assetPath8Videos(`${path}.mp4`) },
//     { type: 'video/webm', src: assetPath8Videos(`${path}.webm`) }
// ]);

// console.log(multiSourceVideo('/assets/8/videos/juicy-tender-loop-640-480'))

export const CONSTANTS = {
    officeWaterSurfaces: [
        "ceiling005_2",
        "furniture005_0",
        "furniture005_1",
        "walls005_4",
        "walls005_7"
    ],
    auxMedia: [{
        meta: {
            type: 'video',
            mimetype: 'video/mp4',
            name: 'greem-vid1',
            sources: multiSourceVideo('/assets/8/videos/juicy-tender-loop-640-480'),
            geometry: new THREE.PlaneBufferGeometry(1, 1),
            position: [0, 0, 0],
            playbackRate: 1,
            loop: true,
            invert: true,
            volume: .1,
            muted: true,
            angle: 0.0
        },
        mesh: undefined,
    }]

}