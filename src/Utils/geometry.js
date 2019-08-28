import * as THREE from 'three';

export function faceCentroid(face, vertices) {
  const v1 = vertices[face.a];
  const v2 = vertices[face.b];
  const v3 = vertices[face.c];
  return new THREE.Vector3(
    (v1.x + v2.x + v3.x) / 3,
    (v1.y + v2.y + v3.y) / 3,
    (v1.z + v2.z + v3.z) / 3,
  );
}