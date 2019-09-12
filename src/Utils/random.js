import * as THREE from 'three';


export function cryptoRandom(arrayLength){
    const pickFromArray = new Uint32Array(arrayLength);
    return window.crypto.getRandomValues(pickFromArray);
}


// TODO this would suck for huge arrays
export function randomArrayVal(array) {
    const pickFromArray = cryptoRandom(array.length);
    window.crypto.getRandomValues(pickFromArray);
    const idx = pickFromArray[THREE.Math.randInt(0, array.length - 1)] % array.length;
    return array[idx];
}
