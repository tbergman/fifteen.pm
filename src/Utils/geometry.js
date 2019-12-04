import * as THREE from 'three';

export function subdivideTriangle(triangle) {
  const normal = new THREE.Vector3();
  return {
    i1: triangle.a,
    i2: triangle.b,
    i3: triangle.c,
    a: getMiddle(triangle.a, triangle.b),
    b: getMiddle(triangle.b, triangle.c),
    c: getMiddle(triangle.a, triangle.c),
    normal: triangle.getNormal(normal), // TODO this is not strictly all the normals, but generally it's close
  }
}

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

export function lineSegmentFromVertices(vertices) {
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  var edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xff0000 }))
}

// https://gist.github.com/kamend/2f825621825466e0d2bdaac72afd498e
export function getMiddle(pointA, pointB) {
  let middle = new THREE.Vector3()
  middle.subVectors(pointB.clone(), pointA.clone())
  middle.multiplyScalar(0.5)
  middle.subVectors(pointB.clone(), middle)
  return middle.clone()
}

export function triangleCentroid(triangle) {
  const middle = getMiddle(triangle.a, triangle.b);
  const opposite = triangle.c;
  const centroid = getMiddle(middle, opposite);
  return centroid.clone();
}

export function triangleFromFace(face, vertices) {
  return triangleFromVertices(
    vertices[face.a],
    vertices[face.b],
    vertices[face.c]
  );
}

export function triangleFromVertices(v1, v2, v3) {
  return new THREE.Triangle(v1, v2, v3);
}

export function triangleCentroidFromVertices(v1, v2, v3) {
  const triangle = triangleFromVertices(v1, v2, v3);
  return triangleCentroid(triangle);
}

