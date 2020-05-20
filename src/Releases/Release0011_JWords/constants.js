
import { assetPath } from "../../Common/Utils/assets";

export const HEADSPACE_1_PATH = assetPath("11/objects/headspace1/main.gltf");
export const HEADSPACE_2_PATH = assetPath("11/objects/headspace2/main.glb");
export const HEADSPACE_3_PATH = assetPath("11/objects/headspace3/main.glb");
export const HEADSPACE_4_PATH = assetPath("11/objects/headspace4/main.gltf");
export const HEADSPACE_8_PATH = assetPath("11/objects/headspace8/main.gltf");
export const HEADSPACE_9_PATH = assetPath("11/objects/headspace9/main.glb");


// e.g.
export const trackMetadata = {
    fear: {
        headspace: {
            path: assetPath("11/objects/headspace9/main.glb"),
            heads: [
                {
                    material: {
                        name: "noise",
                        timeScale: .000075,
                    }
                },
            ]
        },

    },
    remedy: {
        headspace: {
            path: assetPath("11/objects/headspace9/main.glb"),
            material: {
                name: "noise",
                timeScale: .0001,
            }
        },
    },
    radioFreak: {
        headspace: {
            path: assetPath("11/objects/headspace9/main.glb"),
        },
    },
}
