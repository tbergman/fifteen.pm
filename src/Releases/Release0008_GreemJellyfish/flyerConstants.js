import * as THREE from "three";

import {multiSourceVideo} from '../../Utils/Video/paths.js'
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
            volume: .8,
            muted: false,
            angle: 0.0
        },
        mesh: undefined,
    }]

}