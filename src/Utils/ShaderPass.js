/**
 * @author alteredq / http://alteredqualia.com/
 */
import * as THREE from 'three';

/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.
const edgeTable = new Int32Array( [
  0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
  0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
  0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
  0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
  0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c,
  0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
  0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac,
  0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
  0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c,
  0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
  0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
  0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
  0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c,
  0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
  0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc,
  0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
  0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
  0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
  0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
  0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
  0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
  0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
  0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
  0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
  0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
  0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
  0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
  0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
  0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
  0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
  0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
  0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0 ] );

const triTable = new Int32Array( [
  - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 1, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 8, 3, 9, 8, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, 1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 2, 10, 0, 2, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 8, 3, 2, 10, 8, 10, 9, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 11, 2, 8, 11, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 9, 0, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 11, 2, 1, 9, 11, 9, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 10, 1, 11, 10, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 10, 1, 0, 8, 10, 8, 11, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 9, 0, 3, 11, 9, 11, 10, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 8, 10, 10, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 3, 0, 7, 3, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 1, 9, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 1, 9, 4, 7, 1, 7, 3, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 4, 7, 3, 0, 4, 1, 2, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 2, 10, 9, 0, 2, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, - 1, - 1, - 1, - 1,
  8, 4, 7, 3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 4, 7, 11, 2, 4, 2, 0, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 0, 1, 8, 4, 7, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, - 1, - 1, - 1, - 1,
  3, 10, 1, 3, 11, 10, 7, 8, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, - 1, - 1, - 1, - 1,
  4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, - 1, - 1, - 1, - 1,
  4, 7, 11, 4, 11, 9, 9, 11, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 5, 4, 0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 5, 4, 1, 5, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 5, 4, 8, 3, 5, 3, 1, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, 9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 0, 8, 1, 2, 10, 4, 9, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 2, 10, 5, 4, 2, 4, 0, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, - 1, - 1, - 1, - 1,
  9, 5, 4, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 11, 2, 0, 8, 11, 4, 9, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 5, 4, 0, 1, 5, 2, 3, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, - 1, - 1, - 1, - 1,
  10, 3, 11, 10, 1, 3, 9, 5, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, - 1, - 1, - 1, - 1,
  5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, - 1, - 1, - 1, - 1,
  5, 4, 8, 5, 8, 10, 10, 8, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 7, 8, 5, 7, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 3, 0, 9, 5, 3, 5, 7, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 7, 8, 0, 1, 7, 1, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 5, 3, 3, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 7, 8, 9, 5, 7, 10, 1, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, - 1, - 1, - 1, - 1,
  8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, - 1, - 1, - 1, - 1,
  2, 10, 5, 2, 5, 3, 3, 5, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 9, 5, 7, 8, 9, 3, 11, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, - 1, - 1, - 1, - 1,
  2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, - 1, - 1, - 1, - 1,
  11, 2, 1, 11, 1, 7, 7, 1, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, - 1, - 1, - 1, - 1,
  5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, - 1,
  11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, - 1,
  11, 10, 5, 7, 11, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 0, 1, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 8, 3, 1, 9, 8, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 6, 5, 2, 6, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 6, 5, 1, 2, 6, 3, 0, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 6, 5, 9, 0, 6, 0, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, - 1, - 1, - 1, - 1,
  2, 3, 11, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 0, 8, 11, 2, 0, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 1, 9, 2, 3, 11, 5, 10, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, - 1, - 1, - 1, - 1,
  6, 3, 11, 6, 5, 3, 5, 1, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, - 1, - 1, - 1, - 1,
  3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, - 1, - 1, - 1, - 1,
  6, 5, 9, 6, 9, 11, 11, 9, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 10, 6, 4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 3, 0, 4, 7, 3, 6, 5, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 9, 0, 5, 10, 6, 8, 4, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, - 1, - 1, - 1, - 1,
  6, 1, 2, 6, 5, 1, 4, 7, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, - 1, - 1, - 1, - 1,
  8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, - 1, - 1, - 1, - 1,
  7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, - 1,
  3, 11, 2, 7, 8, 4, 10, 6, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, - 1, - 1, - 1, - 1,
  0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, - 1, - 1, - 1, - 1,
  9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, - 1,
  8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, - 1, - 1, - 1, - 1,
  5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, - 1,
  0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, - 1,
  6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, - 1, - 1, - 1, - 1,
  10, 4, 9, 6, 4, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 10, 6, 4, 9, 10, 0, 8, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 0, 1, 10, 6, 0, 6, 4, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, - 1, - 1, - 1, - 1,
  1, 4, 9, 1, 2, 4, 2, 6, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, - 1, - 1, - 1, - 1,
  0, 2, 4, 4, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 3, 2, 8, 2, 4, 4, 2, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 4, 9, 10, 6, 4, 11, 2, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, - 1, - 1, - 1, - 1,
  3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, - 1, - 1, - 1, - 1,
  6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, - 1,
  9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, - 1, - 1, - 1, - 1,
  8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, - 1,
  3, 11, 6, 3, 6, 0, 0, 6, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  6, 4, 8, 11, 6, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 10, 6, 7, 8, 10, 8, 9, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, - 1, - 1, - 1, - 1,
  10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, - 1, - 1, - 1, - 1,
  10, 6, 7, 10, 7, 1, 1, 7, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, - 1, - 1, - 1, - 1,
  2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, - 1,
  7, 8, 0, 7, 0, 6, 6, 0, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 3, 2, 6, 7, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, - 1, - 1, - 1, - 1,
  2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, - 1,
  1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, - 1,
  11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, - 1, - 1, - 1, - 1,
  8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, - 1,
  0, 9, 1, 11, 6, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, - 1, - 1, - 1, - 1,
  7, 11, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 0, 8, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 1, 9, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 1, 9, 8, 3, 1, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 1, 2, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, 3, 0, 8, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 9, 0, 2, 10, 9, 6, 11, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, - 1, - 1, - 1, - 1,
  7, 2, 3, 6, 2, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  7, 0, 8, 7, 6, 0, 6, 2, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 7, 6, 2, 3, 7, 0, 1, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, - 1, - 1, - 1, - 1,
  10, 7, 6, 10, 1, 7, 1, 3, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, - 1, - 1, - 1, - 1,
  0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, - 1, - 1, - 1, - 1,
  7, 6, 10, 7, 10, 8, 8, 10, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  6, 8, 4, 11, 8, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 6, 11, 3, 0, 6, 0, 4, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 6, 11, 8, 4, 6, 9, 0, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, - 1, - 1, - 1, - 1,
  6, 8, 4, 6, 11, 8, 2, 10, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, - 1, - 1, - 1, - 1,
  4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, - 1, - 1, - 1, - 1,
  10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, - 1,
  8, 2, 3, 8, 4, 2, 4, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 4, 2, 4, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, - 1, - 1, - 1, - 1,
  1, 9, 4, 1, 4, 2, 2, 4, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, - 1, - 1, - 1, - 1,
  10, 1, 0, 10, 0, 6, 6, 0, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, - 1,
  10, 9, 4, 6, 10, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 9, 5, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, 4, 9, 5, 11, 7, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 0, 1, 5, 4, 0, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, - 1, - 1, - 1, - 1,
  9, 5, 4, 10, 1, 2, 7, 6, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, - 1, - 1, - 1, - 1,
  7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, - 1, - 1, - 1, - 1,
  3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, - 1,
  7, 2, 3, 7, 6, 2, 5, 4, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, - 1, - 1, - 1, - 1,
  3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, - 1, - 1, - 1, - 1,
  6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, - 1,
  9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, - 1, - 1, - 1, - 1,
  1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, - 1,
  4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, - 1,
  7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, - 1, - 1, - 1, - 1,
  6, 9, 5, 6, 11, 9, 11, 8, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, - 1, - 1, - 1, - 1,
  0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, - 1, - 1, - 1, - 1,
  6, 11, 3, 6, 3, 5, 5, 3, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, - 1, - 1, - 1, - 1,
  0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, - 1,
  11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, - 1,
  6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, - 1, - 1, - 1, - 1,
  5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, - 1, - 1, - 1, - 1,
  9, 5, 6, 9, 6, 0, 0, 6, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, - 1,
  1, 5, 6, 2, 1, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, - 1,
  10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, - 1, - 1, - 1, - 1,
  0, 3, 8, 5, 6, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 5, 6, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 5, 10, 7, 5, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 5, 10, 11, 7, 5, 8, 3, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 11, 7, 5, 10, 11, 1, 9, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, - 1, - 1, - 1, - 1,
  11, 1, 2, 11, 7, 1, 7, 5, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, - 1, - 1, - 1, - 1,
  9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, - 1, - 1, - 1, - 1,
  7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, - 1,
  2, 5, 10, 2, 3, 5, 3, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, - 1, - 1, - 1, - 1,
  9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, - 1, - 1, - 1, - 1,
  9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, - 1,
  1, 3, 5, 3, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 7, 0, 7, 1, 1, 7, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 0, 3, 9, 3, 5, 5, 3, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 8, 7, 5, 9, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 8, 4, 5, 10, 8, 10, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, - 1, - 1, - 1, - 1,
  0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, - 1, - 1, - 1, - 1,
  10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, - 1,
  2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, - 1, - 1, - 1, - 1,
  0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, - 1,
  0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, - 1,
  9, 4, 5, 2, 11, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, - 1, - 1, - 1, - 1,
  5, 10, 2, 5, 2, 4, 4, 2, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, - 1,
  5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, - 1, - 1, - 1, - 1,
  8, 4, 5, 8, 5, 3, 3, 5, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 4, 5, 1, 0, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, - 1, - 1, - 1, - 1,
  9, 4, 5, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 11, 7, 4, 9, 11, 9, 10, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, - 1, - 1, - 1, - 1,
  1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, - 1, - 1, - 1, - 1,
  3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, - 1,
  4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, - 1, - 1, - 1, - 1,
  9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, - 1,
  11, 7, 4, 11, 4, 2, 2, 4, 0, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, - 1, - 1, - 1, - 1,
  2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, - 1, - 1, - 1, - 1,
  9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, - 1,
  3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, - 1,
  1, 10, 2, 8, 7, 4, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 9, 1, 4, 1, 7, 7, 1, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, - 1, - 1, - 1, - 1,
  4, 0, 3, 7, 4, 3, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  4, 8, 7, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 10, 8, 10, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 0, 9, 3, 9, 11, 11, 9, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 1, 10, 0, 10, 8, 8, 10, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 1, 10, 11, 3, 10, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 2, 11, 1, 11, 9, 9, 11, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, - 1, - 1, - 1, - 1,
  0, 2, 11, 8, 0, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  3, 2, 11, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 3, 8, 2, 8, 10, 10, 8, 9, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  9, 10, 2, 0, 9, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, - 1, - 1, - 1, - 1,
  1, 10, 2, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  1, 3, 8, 9, 1, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 9, 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  0, 3, 8, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1,
  - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1 ] );


export const MarchingCubes = function ( resolution, material, enableUvs, enableColors ) {

  THREE.ImmediateRenderObject.call( this, material );

  var scope = this;

  // temp buffers used in polygonize

  var vlist = new Float32Array( 12 * 3 );
  var nlist = new Float32Array( 12 * 3 );

  this.enableUvs = enableUvs !== undefined ? enableUvs : false;
  this.enableColors = enableColors !== undefined ? enableColors : false;

  // functions have to be object properties
  // prototype functions kill performance
  // (tested and it was 4x slower !!!)

  this.init = function ( resolution ) {

    this.resolution = resolution;

    // parameters

    this.isolation = 80.0;

    // size of field, 32 is pushing it in Javascript :)

    this.size = resolution;
    this.size2 = this.size * this.size;
    this.size3 = this.size2 * this.size;
    this.halfsize = this.size / 2.0;

    // deltas

    this.delta = 2.0 / this.size;
    this.yd = this.size;
    this.zd = this.size2;

    this.field = new Float32Array( this.size3 );
    this.normal_cache = new Float32Array( this.size3 * 3 );

    // immediate render mode simulator

    this.maxCount = 4096; // TODO: find the fastest size for this buffer
    this.count = 0;

    this.hasPositions = false;
    this.hasNormals = false;
    this.hasColors = false;
    this.hasUvs = false;

    this.positionArray = new Float32Array( this.maxCount * 3 );
    this.normalArray = new Float32Array( this.maxCount * 3 );

    if ( this.enableUvs ) {

      this.uvArray = new Float32Array( this.maxCount * 2 );

    }

    if ( this.enableColors ) {

      this.colorArray = new Float32Array( this.maxCount * 3 );

    }

  };

  ///////////////////////
  // Polygonization
  ///////////////////////

  function lerp( a, b, t ) {

    return a + ( b - a ) * t;

  }

  function VIntX( q, offset, isol, x, y, z, valp1, valp2 ) {

    var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
      nc = scope.normal_cache;

    vlist[ offset + 0 ] = x + mu * scope.delta;
    vlist[ offset + 1 ] = y;
    vlist[ offset + 2 ] = z;

    nlist[ offset + 0 ] = lerp( nc[ q + 0 ], nc[ q + 3 ], mu );
    nlist[ offset + 1 ] = lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
    nlist[ offset + 2 ] = lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

  }

  function VIntY( q, offset, isol, x, y, z, valp1, valp2 ) {

    var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
      nc = scope.normal_cache;

    vlist[ offset + 0 ] = x;
    vlist[ offset + 1 ] = y + mu * scope.delta;
    vlist[ offset + 2 ] = z;

    var q2 = q + scope.yd * 3;

    nlist[ offset + 0 ] = lerp( nc[ q + 0 ], nc[ q2 + 0 ], mu );
    nlist[ offset + 1 ] = lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
    nlist[ offset + 2 ] = lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

  }

  function VIntZ( q, offset, isol, x, y, z, valp1, valp2 ) {

    var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
      nc = scope.normal_cache;

    vlist[ offset + 0 ] = x;
    vlist[ offset + 1 ] = y;
    vlist[ offset + 2 ] = z + mu * scope.delta;

    var q2 = q + scope.zd * 3;

    nlist[ offset + 0 ] = lerp( nc[ q + 0 ], nc[ q2 + 0 ], mu );
    nlist[ offset + 1 ] = lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
    nlist[ offset + 2 ] = lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

  }

  function compNorm( q ) {

    var q3 = q * 3;

    if ( scope.normal_cache[ q3 ] === 0.0 ) {

      scope.normal_cache[ q3 + 0 ] = scope.field[ q - 1 ] - scope.field[ q + 1 ];
      scope.normal_cache[ q3 + 1 ] = scope.field[ q - scope.yd ] - scope.field[ q + scope.yd ];
      scope.normal_cache[ q3 + 2 ] = scope.field[ q - scope.zd ] - scope.field[ q + scope.zd ];

    }

  }

  // Returns total number of triangles. Fills triangles.
  // (this is where most of time is spent - it's inner work of O(n3) loop )

  function polygonize( fx, fy, fz, q, isol, renderCallback ) {

    // cache indices
    var q1 = q + 1,
      qy = q + scope.yd,
      qz = q + scope.zd,
      q1y = q1 + scope.yd,
      q1z = q1 + scope.zd,
      qyz = q + scope.yd + scope.zd,
      q1yz = q1 + scope.yd + scope.zd;

    var cubeindex = 0,
      field0 = scope.field[ q ],
      field1 = scope.field[ q1 ],
      field2 = scope.field[ qy ],
      field3 = scope.field[ q1y ],
      field4 = scope.field[ qz ],
      field5 = scope.field[ q1z ],
      field6 = scope.field[ qyz ],
      field7 = scope.field[ q1yz ];

    if ( field0 < isol ) cubeindex |= 1;
    if ( field1 < isol ) cubeindex |= 2;
    if ( field2 < isol ) cubeindex |= 8;
    if ( field3 < isol ) cubeindex |= 4;
    if ( field4 < isol ) cubeindex |= 16;
    if ( field5 < isol ) cubeindex |= 32;
    if ( field6 < isol ) cubeindex |= 128;
    if ( field7 < isol ) cubeindex |= 64;

    // if cube is entirely in/out of the surface - bail, nothing to draw

    var bits = edgeTable[ cubeindex ];
    if ( bits === 0 ) return 0;

    var d = scope.delta,
      fx2 = fx + d,
      fy2 = fy + d,
      fz2 = fz + d;

    // top of the cube

    if ( bits & 1 ) {

      compNorm( q );
      compNorm( q1 );
      VIntX( q * 3, 0, isol, fx, fy, fz, field0, field1 );

    }

    if ( bits & 2 ) {

      compNorm( q1 );
      compNorm( q1y );
      VIntY( q1 * 3, 3, isol, fx2, fy, fz, field1, field3 );

    }

    if ( bits & 4 ) {

      compNorm( qy );
      compNorm( q1y );
      VIntX( qy * 3, 6, isol, fx, fy2, fz, field2, field3 );

    }

    if ( bits & 8 ) {

      compNorm( q );
      compNorm( qy );
      VIntY( q * 3, 9, isol, fx, fy, fz, field0, field2 );

    }

    // bottom of the cube

    if ( bits & 16 ) {

      compNorm( qz );
      compNorm( q1z );
      VIntX( qz * 3, 12, isol, fx, fy, fz2, field4, field5 );

    }

    if ( bits & 32 ) {

      compNorm( q1z );
      compNorm( q1yz );
      VIntY( q1z * 3, 15, isol, fx2, fy, fz2, field5, field7 );

    }

    if ( bits & 64 ) {

      compNorm( qyz );
      compNorm( q1yz );
      VIntX( qyz * 3, 18, isol, fx, fy2, fz2, field6, field7 );

    }

    if ( bits & 128 ) {

      compNorm( qz );
      compNorm( qyz );
      VIntY( qz * 3, 21, isol, fx, fy, fz2, field4, field6 );

    }

    // vertical lines of the cube

    if ( bits & 256 ) {

      compNorm( q );
      compNorm( qz );
      VIntZ( q * 3, 24, isol, fx, fy, fz, field0, field4 );

    }

    if ( bits & 512 ) {

      compNorm( q1 );
      compNorm( q1z );
      VIntZ( q1 * 3, 27, isol, fx2, fy, fz, field1, field5 );

    }

    if ( bits & 1024 ) {

      compNorm( q1y );
      compNorm( q1yz );
      VIntZ( q1y * 3, 30, isol, fx2, fy2, fz, field3, field7 );

    }

    if ( bits & 2048 ) {

      compNorm( qy );
      compNorm( qyz );
      VIntZ( qy * 3, 33, isol, fx, fy2, fz, field2, field6 );

    }

    cubeindex <<= 4; // re-purpose cubeindex into an offset into triTable

    var o1, o2, o3, numtris = 0, i = 0;

    // here is where triangles are created

    while ( triTable[ cubeindex + i ] != - 1 ) {

      o1 = cubeindex + i;
      o2 = o1 + 1;
      o3 = o1 + 2;

      posnormtriv( vlist, nlist,
        3 * triTable[ o1 ],
        3 * triTable[ o2 ],
        3 * triTable[ o3 ],
        renderCallback );

      i += 3;
      numtris ++;

    }

    return numtris;

  }

  /////////////////////////////////////
  // Immediate render mode simulator
  /////////////////////////////////////

  function posnormtriv( pos, norm, o1, o2, o3, renderCallback ) {

    var c = scope.count * 3;

    // positions

    scope.positionArray[ c + 0 ] = pos[ o1 ];
    scope.positionArray[ c + 1 ] = pos[ o1 + 1 ];
    scope.positionArray[ c + 2 ] = pos[ o1 + 2 ];

    scope.positionArray[ c + 3 ] = pos[ o2 ];
    scope.positionArray[ c + 4 ] = pos[ o2 + 1 ];
    scope.positionArray[ c + 5 ] = pos[ o2 + 2 ];

    scope.positionArray[ c + 6 ] = pos[ o3 ];
    scope.positionArray[ c + 7 ] = pos[ o3 + 1 ];
    scope.positionArray[ c + 8 ] = pos[ o3 + 2 ];

    // normals

    scope.normalArray[ c + 0 ] = norm[ o1 ];
    scope.normalArray[ c + 1 ] = norm[ o1 + 1 ];
    scope.normalArray[ c + 2 ] = norm[ o1 + 2 ];

    scope.normalArray[ c + 3 ] = norm[ o2 ];
    scope.normalArray[ c + 4 ] = norm[ o2 + 1 ];
    scope.normalArray[ c + 5 ] = norm[ o2 + 2 ];

    scope.normalArray[ c + 6 ] = norm[ o3 ];
    scope.normalArray[ c + 7 ] = norm[ o3 + 1 ];
    scope.normalArray[ c + 8 ] = norm[ o3 + 2 ];

    // uvs

    if ( scope.enableUvs ) {

      var d = scope.count * 2;

      scope.uvArray[ d + 0 ] = pos[ o1 ];
      scope.uvArray[ d + 1 ] = pos[ o1 + 2 ];

      scope.uvArray[ d + 2 ] = pos[ o2 ];
      scope.uvArray[ d + 3 ] = pos[ o2 + 2 ];

      scope.uvArray[ d + 4 ] = pos[ o3 ];
      scope.uvArray[ d + 5 ] = pos[ o3 + 2 ];

    }

    // colors

    if ( scope.enableColors ) {

      scope.colorArray[ c + 0 ] = pos[ o1 ];
      scope.colorArray[ c + 1 ] = pos[ o1 + 1 ];
      scope.colorArray[ c + 2 ] = pos[ o1 + 2 ];

      scope.colorArray[ c + 3 ] = pos[ o2 ];
      scope.colorArray[ c + 4 ] = pos[ o2 + 1 ];
      scope.colorArray[ c + 5 ] = pos[ o2 + 2 ];

      scope.colorArray[ c + 6 ] = pos[ o3 ];
      scope.colorArray[ c + 7 ] = pos[ o3 + 1 ];
      scope.colorArray[ c + 8 ] = pos[ o3 + 2 ];

    }

    scope.count += 3;

    if ( scope.count >= scope.maxCount - 3 ) {

      scope.hasPositions = true;
      scope.hasNormals = true;

      if ( scope.enableUvs ) {

        scope.hasUvs = true;

      }

      if ( scope.enableColors ) {

        scope.hasColors = true;

      }

      renderCallback( scope );

    }

  }

  this.begin = function () {

    this.count = 0;

    this.hasPositions = false;
    this.hasNormals = false;
    this.hasUvs = false;
    this.hasColors = false;

  };

  this.end = function ( renderCallback ) {

    if ( this.count === 0 ) return;

    for ( var i = this.count * 3; i < this.positionArray.length; i ++ ) {

      this.positionArray[ i ] = 0.0;

    }

    this.hasPositions = true;
    this.hasNormals = true;

    if ( this.enableUvs ) {

      this.hasUvs = true;

    }

    if ( this.enableColors ) {

      this.hasColors = true;

    }

    renderCallback( this );

  };

  /////////////////////////////////////
  // Metaballs
  /////////////////////////////////////

  // Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
  // a fixed distance, determined by strength and subtract.

  this.addBall = function ( ballx, bally, ballz, strength, subtract ) {

    var sign = Math.sign( strength );
    strength = Math.abs( strength );

    // Let's solve the equation to find the radius:
    // 1.0 / (0.000001 + radius^2) * strength - subtract = 0
    // strength / (radius^2) = subtract
    // strength = subtract * radius^2
    // radius^2 = strength / subtract
    // radius = sqrt(strength / subtract)

    var radius = this.size * Math.sqrt( strength / subtract ),
      zs = ballz * this.size,
      ys = bally * this.size,
      xs = ballx * this.size;

    var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
    var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
    var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
    var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
    var min_x = Math.floor( xs - radius ); if ( min_x < 1 ) min_x = 1;
    var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


    // Don't polygonize in the outer layer because normals aren't
    // well-defined there.

    var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

    for ( z = min_z; z < max_z; z ++ ) {

      z_offset = this.size2 * z;
      fz = z / this.size - ballz;
      fz2 = fz * fz;

      for ( y = min_y; y < max_y; y ++ ) {

        y_offset = z_offset + this.size * y;
        fy = y / this.size - bally;
        fy2 = fy * fy;

        for ( x = min_x; x < max_x; x ++ ) {

          fx = x / this.size - ballx;
          val = strength / ( 0.000001 + fx * fx + fy2 + fz2 ) - subtract;
          if ( val > 0.0 ) this.field[ y_offset + x ] += val * sign;

        }

      }

    }

  };

  this.addPlaneX = function ( strength, subtract ) {

    var x, y, z, xx, val, xdiv, cxy,

      // cache attribute lookups
      size = this.size,
      yd = this.yd,
      zd = this.zd,
      field = this.field,

      dist = size * Math.sqrt( strength / subtract );

    if ( dist > size ) dist = size;

    for ( x = 0; x < dist; x ++ ) {

      xdiv = x / size;
      xx = xdiv * xdiv;
      val = strength / ( 0.0001 + xx ) - subtract;

      if ( val > 0.0 ) {

        for ( y = 0; y < size; y ++ ) {

          cxy = x + y * yd;

          for ( z = 0; z < size; z ++ ) {

            field[ zd * z + cxy ] += val;

          }

        }

      }

    }

  };

  this.addPlaneY = function ( strength, subtract ) {

    var x, y, z, yy, val, ydiv, cy, cxy,

      // cache attribute lookups
      size = this.size,
      yd = this.yd,
      zd = this.zd,
      field = this.field,

      dist = size * Math.sqrt( strength / subtract );

    if ( dist > size ) dist = size;

    for ( y = 0; y < dist; y ++ ) {

      ydiv = y / size;
      yy = ydiv * ydiv;
      val = strength / ( 0.0001 + yy ) - subtract;

      if ( val > 0.0 ) {

        cy = y * yd;

        for ( x = 0; x < size; x ++ ) {

          cxy = cy + x;

          for ( z = 0; z < size; z ++ )
            field[ zd * z + cxy ] += val;

        }

      }

    }

  };

  this.addPlaneZ = function ( strength, subtract ) {

    var x, y, z, zz, val, zdiv, cz, cyz,

      // cache attribute lookups
      size = this.size,
      yd = this.yd,
      zd = this.zd,
      field = this.field,

      dist = size * Math.sqrt( strength / subtract );

    if ( dist > size ) dist = size;

    for ( z = 0; z < dist; z ++ ) {

      zdiv = z / size;
      zz = zdiv * zdiv;
      val = strength / ( 0.0001 + zz ) - subtract;
      if ( val > 0.0 ) {

        cz = zd * z;

        for ( y = 0; y < size; y ++ ) {

          cyz = cz + y * yd;

          for ( x = 0; x < size; x ++ )
            field[ cyz + x ] += val;

        }

      }

    }

  };

  /////////////////////////////////////
  // Updates
  /////////////////////////////////////

  this.reset = function () {

    var i;

    // wipe the normal cache

    for ( i = 0; i < this.size3; i ++ ) {

      this.normal_cache[ i * 3 ] = 0.0;
      this.field[ i ] = 0.0;

    }

  };

  this.render = function ( renderCallback ) {

    this.begin();

    // Triangulate. Yeah, this is slow.

    var smin2 = this.size - 2;

    for ( var z = 1; z < smin2; z ++ ) {

      var z_offset = this.size2 * z;
      var fz = ( z - this.halfsize ) / this.halfsize; //+ 1

      for ( var y = 1; y < smin2; y ++ ) {

        var y_offset = z_offset + this.size * y;
        var fy = ( y - this.halfsize ) / this.halfsize; //+ 1

        for ( var x = 1; x < smin2; x ++ ) {

          var fx = ( x - this.halfsize ) / this.halfsize; //+ 1
          var q = y_offset + x;

          polygonize( fx, fy, fz, q, this.isolation, renderCallback );

        }

      }

    }

    this.end( renderCallback );

  };

  this.generateGeometry = function () {

    console.warn( 'THREE.MarchingCubes: generateGeometry() now returns THREE.BufferGeometry' );
    return this.generateBufferGeometry();

  };

  function concatenate( a, b, length ) {

    var result = new Float32Array( a.length + length );
    result.set( a, 0 );
    result.set( b.slice( 0, length ), a.length );
    return result;

  }

  this.generateBufferGeometry = function () {

    var geo = new THREE.BufferGeometry();
    var posArray = new Float32Array();
    var normArray = new Float32Array();
    var colorArray = new Float32Array();
    var uvArray = new Float32Array();
    var scope = this;

    var geo_callback = function ( object ) {

      if ( scope.hasPositions ) posArray = concatenate( posArray, object.positionArray, object.count * 3 );
      if ( scope.hasNormals ) normArray = concatenate( normArray, object.normalArray, object.count * 3 );
      if ( scope.hasColors ) colorArray = concatenate( colorArray, object.colorArray, object.count * 3 );
      if ( scope.hasUvs ) uvArray = concatenate( uvArray, object.uvArray, object.count * 2 );

      object.count = 0;

    };

    this.render( geo_callback );

    if ( this.hasPositions ) geo.addAttribute( 'position', new THREE.BufferAttribute( posArray, 3 ) );
    if ( this.hasNormals ) geo.addAttribute( 'normal', new THREE.BufferAttribute( normArray, 3 ) );
    if ( this.hasColors ) geo.addAttribute( 'color', new THREE.BufferAttribute( colorArray, 3 ) );
    if ( this.hasUvs ) geo.addAttribute( 'uv', new THREE.BufferAttribute( uvArray, 2 ) );

    return geo;

  };

  this.init( resolution );

};

MarchingCubes.prototype = Object.create( THREE.ImmediateRenderObject.prototype );
MarchingCubes.prototype.constructor = MarchingCubes;

/**
 * @author alteredq / http://alteredqualia.com/
 */

export const EffectComposer = function ( renderer, renderTarget ) {

  this.renderer = renderer;

  if ( renderTarget === undefined ) {

    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    };

    var size = renderer.getDrawingBufferSize();
    renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, parameters );
    renderTarget.texture.name = 'EffectComposer.rt1';

  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();
  this.renderTarget2.texture.name = 'EffectComposer.rt2';

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

  // dependencies

  if ( CopyShader === undefined ) {

    console.error( 'THREE.EffectComposer relies on THREE.CopyShader' );

  }

  if ( ShaderPass === undefined ) {

    console.error( 'THREE.EffectComposer relies on THREE.ShaderPass' );

  }

  this.copyPass = new ShaderPass( CopyShader );

};

Object.assign( EffectComposer.prototype, {

  swapBuffers: function () {

    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;

  },

  addPass: function ( pass ) {

    this.passes.push( pass );

    var size = this.renderer.getDrawingBufferSize();
    pass.setSize( size.width, size.height );

  },

  insertPass: function ( pass, index ) {

    this.passes.splice( index, 0, pass );

  },

  render: function ( delta ) {

    var maskActive = false;

    var pass, i, il = this.passes.length;

    for ( i = 0; i < il; i ++ ) {

      pass = this.passes[ i ];

      if ( pass.enabled === false ) continue;

      pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

      if ( pass.needsSwap ) {

        if ( maskActive ) {

          var context = this.renderer.context;

          context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

          this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

          context.stencilFunc( context.EQUAL, 1, 0xffffffff );

        }

        this.swapBuffers();

      }

      if ( MaskPass !== undefined ) {

        if ( pass instanceof MaskPass ) {

          maskActive = true;

        } else if ( pass instanceof ClearMaskPass ) {

          maskActive = false;

        }

      }

    }

  },

  reset: function ( renderTarget ) {

    if ( renderTarget === undefined ) {

      var size = this.renderer.getDrawingBufferSize();

      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize( size.width, size.height );

    }

    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

  },

  setSize: function ( width, height ) {

    this.renderTarget1.setSize( width, height );
    this.renderTarget2.setSize( width, height );

    for ( var i = 0; i < this.passes.length; i ++ ) {

      this.passes[ i ].setSize( width, height );

    }

  }

} );


const Pass = function () {

  // if set to true, the pass is processed by the composer
  this.enabled = true;

  // if set to true, the pass indicates to swap read and write buffer after rendering
  this.needsSwap = true;

  // if set to true, the pass clears its buffer before rendering
  this.clear = false;

  // if set to true, the result of the pass is rendered to screen
  this.renderToScreen = false;

};

Object.assign( Pass.prototype, {

  setSize: function ( width, height ) {},

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

  }

} );

/**
 * @author alteredq / http://alteredqualia.com/
 */

export function RenderPass( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

  Pass.call( this );

  this.scene = scene;
  this.camera = camera;

  this.overrideMaterial = overrideMaterial;

  this.clearColor = clearColor;
  this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

  this.clear = true;
  this.clearDepth = false;
  this.needsSwap = false;

};

RenderPass.prototype = Object.assign( Object.create( Pass.prototype ), {

  constructor: RenderPass,

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    var oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    this.scene.overrideMaterial = this.overrideMaterial;

    var oldClearColor, oldClearAlpha;

    if ( this.clearColor ) {

      oldClearColor = renderer.getClearColor().getHex();
      oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor( this.clearColor, this.clearAlpha );

    }

    if ( this.clearDepth ) {

      renderer.clearDepth();

    }

    renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

    if ( this.clearColor ) {

      renderer.setClearColor( oldClearColor, oldClearAlpha );

    }

    this.scene.overrideMaterial = null;
    renderer.autoClear = oldAutoClear;
  }

} );

export function ShaderPass( shader, textureID ) {

  Pass.call( this );

  this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

  if ( shader instanceof THREE.ShaderMaterial ) {

    this.uniforms = shader.uniforms;

    this.material = shader;

  } else if ( shader ) {

    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

      defines: Object.assign( {}, shader.defines ),
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader

    } );

  }

  this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
  this.scene = new THREE.Scene();

  this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
  this.quad.frustumCulled = false; // Avoid getting clipped
  this.scene.add( this.quad );

};

ShaderPass.prototype = Object.assign( Object.create( Pass.prototype ), {

  constructor: ShaderPass,

  render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    if ( this.uniforms[ this.textureID ] ) {

      this.uniforms[ this.textureID ].value = readBuffer.texture;

    }

    this.quad.material = this.material;

    if ( this.renderToScreen ) {

      renderer.render( this.scene, this.camera );

    } else {

      renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    }

  }

} );

/**
 * @author alteredq / http://alteredqualia.com/
 */

export const MaskPass = function ( scene, camera ) {

  Pass.call( this );

  this.scene = scene;
  this.camera = camera;

  this.clear = true;
  this.needsSwap = false;

  this.inverse = false;

};

MaskPass.prototype = Object.assign( Object.create( Pass.prototype ), {

  constructor: MaskPass,

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    var context = renderer.context;
    var state = renderer.state;

    // don't update color or depth

    state.buffers.color.setMask( false );
    state.buffers.depth.setMask( false );

    // lock buffers

    state.buffers.color.setLocked( true );
    state.buffers.depth.setLocked( true );

    // set up stencil

    var writeValue, clearValue;

    if ( this.inverse ) {

      writeValue = 0;
      clearValue = 1;

    } else {

      writeValue = 1;
      clearValue = 0;

    }

    state.buffers.stencil.setTest( true );
    state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
    state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
    state.buffers.stencil.setClear( clearValue );

    // draw into the stencil buffer

    renderer.render( this.scene, this.camera, readBuffer, this.clear );
    renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    // unlock color and depth buffer for subsequent rendering

    state.buffers.color.setLocked( false );
    state.buffers.depth.setLocked( false );

    // only render where stencil is set to 1

    state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
    state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );

  }

} );

/**
 * @author alteredq / http://alteredqualia.com/
 * @author davidedc / http://www.sketchpatch.net/
 *
 * NVIDIA FXAA by Timothy Lottes
 * http://timothylottes.blogspot.com/2011/06/fxaa3-source-released.html
 * - WebGL port by @supereggbert
 * http://www.glge.org/demos/fxaa/
 */

export const FXAAShader = {

  uniforms: {

    "tDiffuse":   { value: null },
    "resolution": { value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [
    "precision highp float;",
    "",
    "uniform sampler2D tDiffuse;",
    "",
    "uniform vec2 resolution;",
    "",
    "varying vec2 vUv;",
    "",
    "// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)",
    "",
    "//----------------------------------------------------------------------------------",
    "// File:        es3-kepler\FXAA\assets\shaders/FXAA_DefaultES.frag",
    "// SDK Version: v3.00",
    "// Email:       gameworks@nvidia.com",
    "// Site:        http://developer.nvidia.com/",
    "//",
    "// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.",
    "//",
    "// Redistribution and use in source and binary forms, with or without",
    "// modification, are permitted provided that the following conditions",
    "// are met:",
    "//  * Redistributions of source code must retain the above copyright",
    "//    notice, this list of conditions and the following disclaimer.",
    "//  * Redistributions in binary form must reproduce the above copyright",
    "//    notice, this list of conditions and the following disclaimer in the",
    "//    documentation and/or other materials provided with the distribution.",
    "//  * Neither the name of NVIDIA CORPORATION nor the names of its",
    "//    contributors may be used to endorse or promote products derived",
    "//    from this software without specific prior written permission.",
    "//",
    "// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ``AS IS'' AND ANY",
    "// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE",
    "// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR",
    "// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR",
    "// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,",
    "// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,",
    "// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR",
    "// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY",
    "// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT",
    "// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE",
    "// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.",
    "//",
    "//----------------------------------------------------------------------------------",
    "",
    "#define FXAA_PC 1",
    "#define FXAA_GLSL_100 1",
    "#define FXAA_QUALITY_PRESET 12",
    "",
    "#define FXAA_GREEN_AS_LUMA 1",
    "",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_PC_CONSOLE",
    "    //",
    "    // The console algorithm for PC is included",
    "    // for developers targeting really low spec machines.",
    "    // Likely better to just run FXAA_PC, and use a really low preset.",
    "    //",
    "    #define FXAA_PC_CONSOLE 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_GLSL_120",
    "    #define FXAA_GLSL_120 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_GLSL_130",
    "    #define FXAA_GLSL_130 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_HLSL_3",
    "    #define FXAA_HLSL_3 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_HLSL_4",
    "    #define FXAA_HLSL_4 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_HLSL_5",
    "    #define FXAA_HLSL_5 0",
    "#endif",
    "/*==========================================================================*/",
    "#ifndef FXAA_GREEN_AS_LUMA",
    "    //",
    "    // For those using non-linear color,",
    "    // and either not able to get luma in alpha, or not wanting to,",
    "    // this enables FXAA to run using green as a proxy for luma.",
    "    // So with this enabled, no need to pack luma in alpha.",
    "    //",
    "    // This will turn off AA on anything which lacks some amount of green.",
    "    // Pure red and blue or combination of only R and B, will get no AA.",
    "    //",
    "    // Might want to lower the settings for both,",
    "    //    fxaaConsoleEdgeThresholdMin",
    "    //    fxaaQualityEdgeThresholdMin",
    "    // In order to insure AA does not get turned off on colors",
    "    // which contain a minor amount of green.",
    "    //",
    "    // 1 = On.",
    "    // 0 = Off.",
    "    //",
    "    #define FXAA_GREEN_AS_LUMA 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_EARLY_EXIT",
    "    //",
    "    // Controls algorithm's early exit path.",
    "    // On PS3 turning this ON adds 2 cycles to the shader.",
    "    // On 360 turning this OFF adds 10ths of a millisecond to the shader.",
    "    // Turning this off on console will result in a more blurry image.",
    "    // So this defaults to on.",
    "    //",
    "    // 1 = On.",
    "    // 0 = Off.",
    "    //",
    "    #define FXAA_EARLY_EXIT 1",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_DISCARD",
    "    //",
    "    // Only valid for PC OpenGL currently.",
    "    // Probably will not work when FXAA_GREEN_AS_LUMA = 1.",
    "    //",
    "    // 1 = Use discard on pixels which don't need AA.",
    "    //     For APIs which enable concurrent TEX+ROP from same surface.",
    "    // 0 = Return unchanged color on pixels which don't need AA.",
    "    //",
    "    #define FXAA_DISCARD 0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_FAST_PIXEL_OFFSET",
    "    //",
    "    // Used for GLSL 120 only.",
    "    //",
    "    // 1 = GL API supports fast pixel offsets",
    "    // 0 = do not use fast pixel offsets",
    "    //",
    "    #ifdef GL_EXT_gpu_shader4",
    "        #define FXAA_FAST_PIXEL_OFFSET 1",
    "    #endif",
    "    #ifdef GL_NV_gpu_shader5",
    "        #define FXAA_FAST_PIXEL_OFFSET 1",
    "    #endif",
    "    #ifdef GL_ARB_gpu_shader5",
    "        #define FXAA_FAST_PIXEL_OFFSET 1",
    "    #endif",
    "    #ifndef FXAA_FAST_PIXEL_OFFSET",
    "        #define FXAA_FAST_PIXEL_OFFSET 0",
    "    #endif",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#ifndef FXAA_GATHER4_ALPHA",
    "    //",
    "    // 1 = API supports gather4 on alpha channel.",
    "    // 0 = API does not support gather4 on alpha channel.",
    "    //",
    "    #if (FXAA_HLSL_5 == 1)",
    "        #define FXAA_GATHER4_ALPHA 1",
    "    #endif",
    "    #ifdef GL_ARB_gpu_shader5",
    "        #define FXAA_GATHER4_ALPHA 1",
    "    #endif",
    "    #ifdef GL_NV_gpu_shader5",
    "        #define FXAA_GATHER4_ALPHA 1",
    "    #endif",
    "    #ifndef FXAA_GATHER4_ALPHA",
    "        #define FXAA_GATHER4_ALPHA 0",
    "    #endif",
    "#endif",
    "",
    "",
    "/*============================================================================",
    "                        FXAA QUALITY - TUNING KNOBS",
    "------------------------------------------------------------------------------",
    "NOTE the other tuning knobs are now in the shader function inputs!",
    "============================================================================*/",
    "#ifndef FXAA_QUALITY_PRESET",
    "    //",
    "    // Choose the quality preset.",
    "    // This needs to be compiled into the shader as it effects code.",
    "    // Best option to include multiple presets is to",
    "    // in each shader define the preset, then include this file.",
    "    //",
    "    // OPTIONS",
    "    // -----------------------------------------------------------------------",
    "    // 10 to 15 - default medium dither (10=fastest, 15=highest quality)",
    "    // 20 to 29 - less dither, more expensive (20=fastest, 29=highest quality)",
    "    // 39       - no dither, very expensive",
    "    //",
    "    // NOTES",
    "    // -----------------------------------------------------------------------",
    "    // 12 = slightly faster then FXAA 3.9 and higher edge quality (default)",
    "    // 13 = about same speed as FXAA 3.9 and better than 12",
    "    // 23 = closest to FXAA 3.9 visually and performance wise",
    "    //  _ = the lowest digit is directly related to performance",
    "    // _  = the highest digit is directly related to style",
    "    //",
    "    #define FXAA_QUALITY_PRESET 12",
    "#endif",
    "",
    "",
    "/*============================================================================",
    "",
    "                           FXAA QUALITY - PRESETS",
    "",
    "============================================================================*/",
    "",
    "/*============================================================================",
    "                     FXAA QUALITY - MEDIUM DITHER PRESETS",
    "============================================================================*/",
    "#if (FXAA_QUALITY_PRESET == 10)",
    "    #define FXAA_QUALITY_PS 3",
    "    #define FXAA_QUALITY_P0 1.5",
    "    #define FXAA_QUALITY_P1 3.0",
    "    #define FXAA_QUALITY_P2 12.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 11)",
    "    #define FXAA_QUALITY_PS 4",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 3.0",
    "    #define FXAA_QUALITY_P3 12.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 12)",
    "    #define FXAA_QUALITY_PS 5",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 4.0",
    "    #define FXAA_QUALITY_P4 12.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 13)",
    "    #define FXAA_QUALITY_PS 6",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 4.0",
    "    #define FXAA_QUALITY_P5 12.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 14)",
    "    #define FXAA_QUALITY_PS 7",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 4.0",
    "    #define FXAA_QUALITY_P6 12.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 15)",
    "    #define FXAA_QUALITY_PS 8",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 4.0",
    "    #define FXAA_QUALITY_P7 12.0",
    "#endif",
    "",
    "/*============================================================================",
    "                     FXAA QUALITY - LOW DITHER PRESETS",
    "============================================================================*/",
    "#if (FXAA_QUALITY_PRESET == 20)",
    "    #define FXAA_QUALITY_PS 3",
    "    #define FXAA_QUALITY_P0 1.5",
    "    #define FXAA_QUALITY_P1 2.0",
    "    #define FXAA_QUALITY_P2 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 21)",
    "    #define FXAA_QUALITY_PS 4",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 22)",
    "    #define FXAA_QUALITY_PS 5",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 23)",
    "    #define FXAA_QUALITY_PS 6",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 24)",
    "    #define FXAA_QUALITY_PS 7",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 3.0",
    "    #define FXAA_QUALITY_P6 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 25)",
    "    #define FXAA_QUALITY_PS 8",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 4.0",
    "    #define FXAA_QUALITY_P7 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 26)",
    "    #define FXAA_QUALITY_PS 9",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 2.0",
    "    #define FXAA_QUALITY_P7 4.0",
    "    #define FXAA_QUALITY_P8 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 27)",
    "    #define FXAA_QUALITY_PS 10",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 2.0",
    "    #define FXAA_QUALITY_P7 2.0",
    "    #define FXAA_QUALITY_P8 4.0",
    "    #define FXAA_QUALITY_P9 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 28)",
    "    #define FXAA_QUALITY_PS 11",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 2.0",
    "    #define FXAA_QUALITY_P7 2.0",
    "    #define FXAA_QUALITY_P8 2.0",
    "    #define FXAA_QUALITY_P9 4.0",
    "    #define FXAA_QUALITY_P10 8.0",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_QUALITY_PRESET == 29)",
    "    #define FXAA_QUALITY_PS 12",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.5",
    "    #define FXAA_QUALITY_P2 2.0",
    "    #define FXAA_QUALITY_P3 2.0",
    "    #define FXAA_QUALITY_P4 2.0",
    "    #define FXAA_QUALITY_P5 2.0",
    "    #define FXAA_QUALITY_P6 2.0",
    "    #define FXAA_QUALITY_P7 2.0",
    "    #define FXAA_QUALITY_P8 2.0",
    "    #define FXAA_QUALITY_P9 2.0",
    "    #define FXAA_QUALITY_P10 4.0",
    "    #define FXAA_QUALITY_P11 8.0",
    "#endif",
    "",
    "/*============================================================================",
    "                     FXAA QUALITY - EXTREME QUALITY",
    "============================================================================*/",
    "#if (FXAA_QUALITY_PRESET == 39)",
    "    #define FXAA_QUALITY_PS 12",
    "    #define FXAA_QUALITY_P0 1.0",
    "    #define FXAA_QUALITY_P1 1.0",
    "    #define FXAA_QUALITY_P2 1.0",
    "    #define FXAA_QUALITY_P3 1.0",
    "    #define FXAA_QUALITY_P4 1.0",
    "    #define FXAA_QUALITY_P5 1.5",
    "    #define FXAA_QUALITY_P6 2.0",
    "    #define FXAA_QUALITY_P7 2.0",
    "    #define FXAA_QUALITY_P8 2.0",
    "    #define FXAA_QUALITY_P9 2.0",
    "    #define FXAA_QUALITY_P10 4.0",
    "    #define FXAA_QUALITY_P11 8.0",
    "#endif",
    "",
    "",
    "",
    "/*============================================================================",
    "",
    "                                API PORTING",
    "",
    "============================================================================*/",
    "#if (FXAA_GLSL_100 == 1) || (FXAA_GLSL_120 == 1) || (FXAA_GLSL_130 == 1)",
    "    #define FxaaBool bool",
    "    #define FxaaDiscard discard",
    "    #define FxaaFloat float",
    "    #define FxaaFloat2 vec2",
    "    #define FxaaFloat3 vec3",
    "    #define FxaaFloat4 vec4",
    "    #define FxaaHalf float",
    "    #define FxaaHalf2 vec2",
    "    #define FxaaHalf3 vec3",
    "    #define FxaaHalf4 vec4",
    "    #define FxaaInt2 ivec2",
    "    #define FxaaSat(x) clamp(x, 0.0, 1.0)",
    "    #define FxaaTex sampler2D",
    "#else",
    "    #define FxaaBool bool",
    "    #define FxaaDiscard clip(-1)",
    "    #define FxaaFloat float",
    "    #define FxaaFloat2 float2",
    "    #define FxaaFloat3 float3",
    "    #define FxaaFloat4 float4",
    "    #define FxaaHalf half",
    "    #define FxaaHalf2 half2",
    "    #define FxaaHalf3 half3",
    "    #define FxaaHalf4 half4",
    "    #define FxaaSat(x) saturate(x)",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_GLSL_100 == 1)",
    "  #define FxaaTexTop(t, p) texture2D(t, p, 0.0)",
    "  #define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), 0.0)",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_GLSL_120 == 1)",
    "    // Requires,",
    "    //  #version 120",
    "    // And at least,",
    "    //  #extension GL_EXT_gpu_shader4 : enable",
    "    //  (or set FXAA_FAST_PIXEL_OFFSET 1 to work like DX9)",
    "    #define FxaaTexTop(t, p) texture2DLod(t, p, 0.0)",
    "    #if (FXAA_FAST_PIXEL_OFFSET == 1)",
    "        #define FxaaTexOff(t, p, o, r) texture2DLodOffset(t, p, 0.0, o)",
    "    #else",
    "        #define FxaaTexOff(t, p, o, r) texture2DLod(t, p + (o * r), 0.0)",
    "    #endif",
    "    #if (FXAA_GATHER4_ALPHA == 1)",
    "        // use #extension GL_ARB_gpu_shader5 : enable",
    "        #define FxaaTexAlpha4(t, p) textureGather(t, p, 3)",
    "        #define FxaaTexOffAlpha4(t, p, o) textureGatherOffset(t, p, o, 3)",
    "        #define FxaaTexGreen4(t, p) textureGather(t, p, 1)",
    "        #define FxaaTexOffGreen4(t, p, o) textureGatherOffset(t, p, o, 1)",
    "    #endif",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_GLSL_130 == 1)",
    "    // Requires \"#version 130\" or better",
    "    #define FxaaTexTop(t, p) textureLod(t, p, 0.0)",
    "    #define FxaaTexOff(t, p, o, r) textureLodOffset(t, p, 0.0, o)",
    "    #if (FXAA_GATHER4_ALPHA == 1)",
    "        // use #extension GL_ARB_gpu_shader5 : enable",
    "        #define FxaaTexAlpha4(t, p) textureGather(t, p, 3)",
    "        #define FxaaTexOffAlpha4(t, p, o) textureGatherOffset(t, p, o, 3)",
    "        #define FxaaTexGreen4(t, p) textureGather(t, p, 1)",
    "        #define FxaaTexOffGreen4(t, p, o) textureGatherOffset(t, p, o, 1)",
    "    #endif",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_HLSL_3 == 1)",
    "    #define FxaaInt2 float2",
    "    #define FxaaTex sampler2D",
    "    #define FxaaTexTop(t, p) tex2Dlod(t, float4(p, 0.0, 0.0))",
    "    #define FxaaTexOff(t, p, o, r) tex2Dlod(t, float4(p + (o * r), 0, 0))",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_HLSL_4 == 1)",
    "    #define FxaaInt2 int2",
    "    struct FxaaTex { SamplerState smpl; Texture2D tex; };",
    "    #define FxaaTexTop(t, p) t.tex.SampleLevel(t.smpl, p, 0.0)",
    "    #define FxaaTexOff(t, p, o, r) t.tex.SampleLevel(t.smpl, p, 0.0, o)",
    "#endif",
    "/*--------------------------------------------------------------------------*/",
    "#if (FXAA_HLSL_5 == 1)",
    "    #define FxaaInt2 int2",
    "    struct FxaaTex { SamplerState smpl; Texture2D tex; };",
    "    #define FxaaTexTop(t, p) t.tex.SampleLevel(t.smpl, p, 0.0)",
    "    #define FxaaTexOff(t, p, o, r) t.tex.SampleLevel(t.smpl, p, 0.0, o)",
    "    #define FxaaTexAlpha4(t, p) t.tex.GatherAlpha(t.smpl, p)",
    "    #define FxaaTexOffAlpha4(t, p, o) t.tex.GatherAlpha(t.smpl, p, o)",
    "    #define FxaaTexGreen4(t, p) t.tex.GatherGreen(t.smpl, p)",
    "    #define FxaaTexOffGreen4(t, p, o) t.tex.GatherGreen(t.smpl, p, o)",
    "#endif",
    "",
    "",
    "/*============================================================================",
    "                   GREEN AS LUMA OPTION SUPPORT FUNCTION",
    "============================================================================*/",
    "#if (FXAA_GREEN_AS_LUMA == 0)",
    "    FxaaFloat FxaaLuma(FxaaFloat4 rgba) { return rgba.w; }",
    "#else",
    "    FxaaFloat FxaaLuma(FxaaFloat4 rgba) { return rgba.y; }",
    "#endif",
    "",
    "",
    "",
    "",
    "/*============================================================================",
    "",
    "                             FXAA3 QUALITY - PC",
    "",
    "============================================================================*/",
    "#if (FXAA_PC == 1)",
    "/*--------------------------------------------------------------------------*/",
    "FxaaFloat4 FxaaPixelShader(",
    "    //",
    "    // Use noperspective interpolation here (turn off perspective interpolation).",
    "    // {xy} = center of pixel",
    "    FxaaFloat2 pos,",
    "    //",
    "    // Used only for FXAA Console, and not used on the 360 version.",
    "    // Use noperspective interpolation here (turn off perspective interpolation).",
    "    // {xy_} = upper left of pixel",
    "    // {_zw} = lower right of pixel",
    "    FxaaFloat4 fxaaConsolePosPos,",
    "    //",
    "    // Input color texture.",
    "    // {rgb_} = color in linear or perceptual color space",
    "    // if (FXAA_GREEN_AS_LUMA == 0)",
    "    //     {__a} = luma in perceptual color space (not linear)",
    "    FxaaTex tex,",
    "    //",
    "    // Only used on the optimized 360 version of FXAA Console.",
    "    // For everything but 360, just use the same input here as for \"tex\".",
    "    // For 360, same texture, just alias with a 2nd sampler.",
    "    // This sampler needs to have an exponent bias of -1.",
    "    FxaaTex fxaaConsole360TexExpBiasNegOne,",
    "    //",
    "    // Only used on the optimized 360 version of FXAA Console.",
    "    // For everything but 360, just use the same input here as for \"tex\".",
    "    // For 360, same texture, just alias with a 3nd sampler.",
    "    // This sampler needs to have an exponent bias of -2.",
    "    FxaaTex fxaaConsole360TexExpBiasNegTwo,",
    "    //",
    "    // Only used on FXAA Quality.",
    "    // This must be from a constant/uniform.",
    "    // {x_} = 1.0/screenWidthInPixels",
    "    // {_y} = 1.0/screenHeightInPixels",
    "    FxaaFloat2 fxaaQualityRcpFrame,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // This must be from a constant/uniform.",
    "    // This effects sub-pixel AA quality and inversely sharpness.",
    "    //   Where N ranges between,",
    "    //     N = 0.50 (default)",
    "    //     N = 0.33 (sharper)",
    "    // {x__} = -N/screenWidthInPixels",
    "    // {_y_} = -N/screenHeightInPixels",
    "    // {_z_} =  N/screenWidthInPixels",
    "    // {__w} =  N/screenHeightInPixels",
    "    FxaaFloat4 fxaaConsoleRcpFrameOpt,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // Not used on 360, but used on PS3 and PC.",
    "    // This must be from a constant/uniform.",
    "    // {x__} = -2.0/screenWidthInPixels",
    "    // {_y_} = -2.0/screenHeightInPixels",
    "    // {_z_} =  2.0/screenWidthInPixels",
    "    // {__w} =  2.0/screenHeightInPixels",
    "    FxaaFloat4 fxaaConsoleRcpFrameOpt2,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // Only used on 360 in place of fxaaConsoleRcpFrameOpt2.",
    "    // This must be from a constant/uniform.",
    "    // {x__} =  8.0/screenWidthInPixels",
    "    // {_y_} =  8.0/screenHeightInPixels",
    "    // {_z_} = -4.0/screenWidthInPixels",
    "    // {__w} = -4.0/screenHeightInPixels",
    "    FxaaFloat4 fxaaConsole360RcpFrameOpt2,",
    "    //",
    "    // Only used on FXAA Quality.",
    "    // This used to be the FXAA_QUALITY_SUBPIX define.",
    "    // It is here now to allow easier tuning.",
    "    // Choose the amount of sub-pixel aliasing removal.",
    "    // This can effect sharpness.",
    "    //   1.00 - upper limit (softer)",
    "    //   0.75 - default amount of filtering",
    "    //   0.50 - lower limit (sharper, less sub-pixel aliasing removal)",
    "    //   0.25 - almost off",
    "    //   0.00 - completely off",
    "    FxaaFloat fxaaQualitySubpix,",
    "    //",
    "    // Only used on FXAA Quality.",
    "    // This used to be the FXAA_QUALITY_EDGE_THRESHOLD define.",
    "    // It is here now to allow easier tuning.",
    "    // The minimum amount of local contrast required to apply algorithm.",
    "    //   0.333 - too little (faster)",
    "    //   0.250 - low quality",
    "    //   0.166 - default",
    "    //   0.125 - high quality",
    "    //   0.063 - overkill (slower)",
    "    FxaaFloat fxaaQualityEdgeThreshold,",
    "    //",
    "    // Only used on FXAA Quality.",
    "    // This used to be the FXAA_QUALITY_EDGE_THRESHOLD_MIN define.",
    "    // It is here now to allow easier tuning.",
    "    // Trims the algorithm from processing darks.",
    "    //   0.0833 - upper limit (default, the start of visible unfiltered edges)",
    "    //   0.0625 - high quality (faster)",
    "    //   0.0312 - visible limit (slower)",
    "    // Special notes when using FXAA_GREEN_AS_LUMA,",
    "    //   Likely want to set this to zero.",
    "    //   As colors that are mostly not-green",
    "    //   will appear very dark in the green channel!",
    "    //   Tune by looking at mostly non-green content,",
    "    //   then start at zero and increase until aliasing is a problem.",
    "    FxaaFloat fxaaQualityEdgeThresholdMin,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // This used to be the FXAA_CONSOLE_EDGE_SHARPNESS define.",
    "    // It is here now to allow easier tuning.",
    "    // This does not effect PS3, as this needs to be compiled in.",
    "    //   Use FXAA_CONSOLE_PS3_EDGE_SHARPNESS for PS3.",
    "    //   Due to the PS3 being ALU bound,",
    "    //   there are only three safe values here: 2 and 4 and 8.",
    "    //   These options use the shaders ability to a free *|/ by 2|4|8.",
    "    // For all other platforms can be a non-power of two.",
    "    //   8.0 is sharper (default!!!)",
    "    //   4.0 is softer",
    "    //   2.0 is really soft (good only for vector graphics inputs)",
    "    FxaaFloat fxaaConsoleEdgeSharpness,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // This used to be the FXAA_CONSOLE_EDGE_THRESHOLD define.",
    "    // It is here now to allow easier tuning.",
    "    // This does not effect PS3, as this needs to be compiled in.",
    "    //   Use FXAA_CONSOLE_PS3_EDGE_THRESHOLD for PS3.",
    "    //   Due to the PS3 being ALU bound,",
    "    //   there are only two safe values here: 1/4 and 1/8.",
    "    //   These options use the shaders ability to a free *|/ by 2|4|8.",
    "    // The console setting has a different mapping than the quality setting.",
    "    // Other platforms can use other values.",
    "    //   0.125 leaves less aliasing, but is softer (default!!!)",
    "    //   0.25 leaves more aliasing, and is sharper",
    "    FxaaFloat fxaaConsoleEdgeThreshold,",
    "    //",
    "    // Only used on FXAA Console.",
    "    // This used to be the FXAA_CONSOLE_EDGE_THRESHOLD_MIN define.",
    "    // It is here now to allow easier tuning.",
    "    // Trims the algorithm from processing darks.",
    "    // The console setting has a different mapping than the quality setting.",
    "    // This only applies when FXAA_EARLY_EXIT is 1.",
    "    // This does not apply to PS3,",
    "    // PS3 was simplified to avoid more shader instructions.",
    "    //   0.06 - faster but more aliasing in darks",
    "    //   0.05 - default",
    "    //   0.04 - slower and less aliasing in darks",
    "    // Special notes when using FXAA_GREEN_AS_LUMA,",
    "    //   Likely want to set this to zero.",
    "    //   As colors that are mostly not-green",
    "    //   will appear very dark in the green channel!",
    "    //   Tune by looking at mostly non-green content,",
    "    //   then start at zero and increase until aliasing is a problem.",
    "    FxaaFloat fxaaConsoleEdgeThresholdMin,",
    "    //",
    "    // Extra constants for 360 FXAA Console only.",
    "    // Use zeros or anything else for other platforms.",
    "    // These must be in physical constant registers and NOT immedates.",
    "    // Immedates will result in compiler un-optimizing.",
    "    // {xyzw} = float4(1.0, -1.0, 0.25, -0.25)",
    "    FxaaFloat4 fxaaConsole360ConstDir",
    ") {",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat2 posM;",
    "    posM.x = pos.x;",
    "    posM.y = pos.y;",
    "    #if (FXAA_GATHER4_ALPHA == 1)",
    "        #if (FXAA_DISCARD == 0)",
    "            FxaaFloat4 rgbyM = FxaaTexTop(tex, posM);",
    "            #if (FXAA_GREEN_AS_LUMA == 0)",
    "                #define lumaM rgbyM.w",
    "            #else",
    "                #define lumaM rgbyM.y",
    "            #endif",
    "        #endif",
    "        #if (FXAA_GREEN_AS_LUMA == 0)",
    "            FxaaFloat4 luma4A = FxaaTexAlpha4(tex, posM);",
    "            FxaaFloat4 luma4B = FxaaTexOffAlpha4(tex, posM, FxaaInt2(-1, -1));",
    "        #else",
    "            FxaaFloat4 luma4A = FxaaTexGreen4(tex, posM);",
    "            FxaaFloat4 luma4B = FxaaTexOffGreen4(tex, posM, FxaaInt2(-1, -1));",
    "        #endif",
    "        #if (FXAA_DISCARD == 1)",
    "            #define lumaM luma4A.w",
    "        #endif",
    "        #define lumaE luma4A.z",
    "        #define lumaS luma4A.x",
    "        #define lumaSE luma4A.y",
    "        #define lumaNW luma4B.w",
    "        #define lumaN luma4B.z",
    "        #define lumaW luma4B.x",
    "    #else",
    "        FxaaFloat4 rgbyM = FxaaTexTop(tex, posM);",
    "        #if (FXAA_GREEN_AS_LUMA == 0)",
    "            #define lumaM rgbyM.w",
    "        #else",
    "            #define lumaM rgbyM.y",
    "        #endif",
    "        #if (FXAA_GLSL_100 == 1)",
    "          FxaaFloat lumaS = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2( 0.0, 1.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaE = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2( 1.0, 0.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaN = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2( 0.0,-1.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaW = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2(-1.0, 0.0), fxaaQualityRcpFrame.xy));",
    "        #else",
    "          FxaaFloat lumaS = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2( 0, 1), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaE = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2( 1, 0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaN = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2( 0,-1), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaW = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2(-1, 0), fxaaQualityRcpFrame.xy));",
    "        #endif",
    "    #endif",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat maxSM = max(lumaS, lumaM);",
    "    FxaaFloat minSM = min(lumaS, lumaM);",
    "    FxaaFloat maxESM = max(lumaE, maxSM);",
    "    FxaaFloat minESM = min(lumaE, minSM);",
    "    FxaaFloat maxWN = max(lumaN, lumaW);",
    "    FxaaFloat minWN = min(lumaN, lumaW);",
    "    FxaaFloat rangeMax = max(maxWN, maxESM);",
    "    FxaaFloat rangeMin = min(minWN, minESM);",
    "    FxaaFloat rangeMaxScaled = rangeMax * fxaaQualityEdgeThreshold;",
    "    FxaaFloat range = rangeMax - rangeMin;",
    "    FxaaFloat rangeMaxClamped = max(fxaaQualityEdgeThresholdMin, rangeMaxScaled);",
    "    FxaaBool earlyExit = range < rangeMaxClamped;",
    "/*--------------------------------------------------------------------------*/",
    "    if(earlyExit)",
    "        #if (FXAA_DISCARD == 1)",
    "            FxaaDiscard;",
    "        #else",
    "            return rgbyM;",
    "        #endif",
    "/*--------------------------------------------------------------------------*/",
    "    #if (FXAA_GATHER4_ALPHA == 0)",
    "        #if (FXAA_GLSL_100 == 1)",
    "          FxaaFloat lumaNW = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2(-1.0,-1.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaSE = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2( 1.0, 1.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaNE = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2( 1.0,-1.0), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaSW = FxaaLuma(FxaaTexOff(tex, posM, FxaaFloat2(-1.0, 1.0), fxaaQualityRcpFrame.xy));",
    "        #else",
    "          FxaaFloat lumaNW = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2(-1,-1), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaSE = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2( 1, 1), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaNE = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2( 1,-1), fxaaQualityRcpFrame.xy));",
    "          FxaaFloat lumaSW = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2(-1, 1), fxaaQualityRcpFrame.xy));",
    "        #endif",
    "    #else",
    "        FxaaFloat lumaNE = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2(1, -1), fxaaQualityRcpFrame.xy));",
    "        FxaaFloat lumaSW = FxaaLuma(FxaaTexOff(tex, posM, FxaaInt2(-1, 1), fxaaQualityRcpFrame.xy));",
    "    #endif",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat lumaNS = lumaN + lumaS;",
    "    FxaaFloat lumaWE = lumaW + lumaE;",
    "    FxaaFloat subpixRcpRange = 1.0/range;",
    "    FxaaFloat subpixNSWE = lumaNS + lumaWE;",
    "    FxaaFloat edgeHorz1 = (-2.0 * lumaM) + lumaNS;",
    "    FxaaFloat edgeVert1 = (-2.0 * lumaM) + lumaWE;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat lumaNESE = lumaNE + lumaSE;",
    "    FxaaFloat lumaNWNE = lumaNW + lumaNE;",
    "    FxaaFloat edgeHorz2 = (-2.0 * lumaE) + lumaNESE;",
    "    FxaaFloat edgeVert2 = (-2.0 * lumaN) + lumaNWNE;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat lumaNWSW = lumaNW + lumaSW;",
    "    FxaaFloat lumaSWSE = lumaSW + lumaSE;",
    "    FxaaFloat edgeHorz4 = (abs(edgeHorz1) * 2.0) + abs(edgeHorz2);",
    "    FxaaFloat edgeVert4 = (abs(edgeVert1) * 2.0) + abs(edgeVert2);",
    "    FxaaFloat edgeHorz3 = (-2.0 * lumaW) + lumaNWSW;",
    "    FxaaFloat edgeVert3 = (-2.0 * lumaS) + lumaSWSE;",
    "    FxaaFloat edgeHorz = abs(edgeHorz3) + edgeHorz4;",
    "    FxaaFloat edgeVert = abs(edgeVert3) + edgeVert4;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat subpixNWSWNESE = lumaNWSW + lumaNESE;",
    "    FxaaFloat lengthSign = fxaaQualityRcpFrame.x;",
    "    FxaaBool horzSpan = edgeHorz >= edgeVert;",
    "    FxaaFloat subpixA = subpixNSWE * 2.0 + subpixNWSWNESE;",
    "/*--------------------------------------------------------------------------*/",
    "    if(!horzSpan) lumaN = lumaW;",
    "    if(!horzSpan) lumaS = lumaE;",
    "    if(horzSpan) lengthSign = fxaaQualityRcpFrame.y;",
    "    FxaaFloat subpixB = (subpixA * (1.0/12.0)) - lumaM;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat gradientN = lumaN - lumaM;",
    "    FxaaFloat gradientS = lumaS - lumaM;",
    "    FxaaFloat lumaNN = lumaN + lumaM;",
    "    FxaaFloat lumaSS = lumaS + lumaM;",
    "    FxaaBool pairN = abs(gradientN) >= abs(gradientS);",
    "    FxaaFloat gradient = max(abs(gradientN), abs(gradientS));",
    "    if(pairN) lengthSign = -lengthSign;",
    "    FxaaFloat subpixC = FxaaSat(abs(subpixB) * subpixRcpRange);",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat2 posB;",
    "    posB.x = posM.x;",
    "    posB.y = posM.y;",
    "    FxaaFloat2 offNP;",
    "    offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;",
    "    offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;",
    "    if(!horzSpan) posB.x += lengthSign * 0.5;",
    "    if( horzSpan) posB.y += lengthSign * 0.5;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat2 posN;",
    "    posN.x = posB.x - offNP.x * FXAA_QUALITY_P0;",
    "    posN.y = posB.y - offNP.y * FXAA_QUALITY_P0;",
    "    FxaaFloat2 posP;",
    "    posP.x = posB.x + offNP.x * FXAA_QUALITY_P0;",
    "    posP.y = posB.y + offNP.y * FXAA_QUALITY_P0;",
    "    FxaaFloat subpixD = ((-2.0)*subpixC) + 3.0;",
    "    FxaaFloat lumaEndN = FxaaLuma(FxaaTexTop(tex, posN));",
    "    FxaaFloat subpixE = subpixC * subpixC;",
    "    FxaaFloat lumaEndP = FxaaLuma(FxaaTexTop(tex, posP));",
    "/*--------------------------------------------------------------------------*/",
    "    if(!pairN) lumaNN = lumaSS;",
    "    FxaaFloat gradientScaled = gradient * 1.0/4.0;",
    "    FxaaFloat lumaMM = lumaM - lumaNN * 0.5;",
    "    FxaaFloat subpixF = subpixD * subpixE;",
    "    FxaaBool lumaMLTZero = lumaMM < 0.0;",
    "/*--------------------------------------------------------------------------*/",
    "    lumaEndN -= lumaNN * 0.5;",
    "    lumaEndP -= lumaNN * 0.5;",
    "    FxaaBool doneN = abs(lumaEndN) >= gradientScaled;",
    "    FxaaBool doneP = abs(lumaEndP) >= gradientScaled;",
    "    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P1;",
    "    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P1;",
    "    FxaaBool doneNP = (!doneN) || (!doneP);",
    "    if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P1;",
    "    if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P1;",
    "/*--------------------------------------------------------------------------*/",
    "    if(doneNP) {",
    "        if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "        if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "        doneN = abs(lumaEndN) >= gradientScaled;",
    "        doneP = abs(lumaEndP) >= gradientScaled;",
    "        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P2;",
    "        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P2;",
    "        doneNP = (!doneN) || (!doneP);",
    "        if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P2;",
    "        if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P2;",
    "/*--------------------------------------------------------------------------*/",
    "        #if (FXAA_QUALITY_PS > 3)",
    "        if(doneNP) {",
    "            if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "            if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "            doneN = abs(lumaEndN) >= gradientScaled;",
    "            doneP = abs(lumaEndP) >= gradientScaled;",
    "            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P3;",
    "            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P3;",
    "            doneNP = (!doneN) || (!doneP);",
    "            if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P3;",
    "            if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P3;",
    "/*--------------------------------------------------------------------------*/",
    "            #if (FXAA_QUALITY_PS > 4)",
    "            if(doneNP) {",
    "                if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                doneN = abs(lumaEndN) >= gradientScaled;",
    "                doneP = abs(lumaEndP) >= gradientScaled;",
    "                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P4;",
    "                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P4;",
    "                doneNP = (!doneN) || (!doneP);",
    "                if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P4;",
    "                if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P4;",
    "/*--------------------------------------------------------------------------*/",
    "                #if (FXAA_QUALITY_PS > 5)",
    "                if(doneNP) {",
    "                    if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                    if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                    doneN = abs(lumaEndN) >= gradientScaled;",
    "                    doneP = abs(lumaEndP) >= gradientScaled;",
    "                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P5;",
    "                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P5;",
    "                    doneNP = (!doneN) || (!doneP);",
    "                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P5;",
    "                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P5;",
    "/*--------------------------------------------------------------------------*/",
    "                    #if (FXAA_QUALITY_PS > 6)",
    "                    if(doneNP) {",
    "                        if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                        if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                        doneN = abs(lumaEndN) >= gradientScaled;",
    "                        doneP = abs(lumaEndP) >= gradientScaled;",
    "                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P6;",
    "                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P6;",
    "                        doneNP = (!doneN) || (!doneP);",
    "                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P6;",
    "                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P6;",
    "/*--------------------------------------------------------------------------*/",
    "                        #if (FXAA_QUALITY_PS > 7)",
    "                        if(doneNP) {",
    "                            if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                            if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                            doneN = abs(lumaEndN) >= gradientScaled;",
    "                            doneP = abs(lumaEndP) >= gradientScaled;",
    "                            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P7;",
    "                            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P7;",
    "                            doneNP = (!doneN) || (!doneP);",
    "                            if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P7;",
    "                            if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P7;",
    "/*--------------------------------------------------------------------------*/",
    "    #if (FXAA_QUALITY_PS > 8)",
    "    if(doneNP) {",
    "        if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "        if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "        doneN = abs(lumaEndN) >= gradientScaled;",
    "        doneP = abs(lumaEndP) >= gradientScaled;",
    "        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P8;",
    "        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P8;",
    "        doneNP = (!doneN) || (!doneP);",
    "        if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P8;",
    "        if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P8;",
    "/*--------------------------------------------------------------------------*/",
    "        #if (FXAA_QUALITY_PS > 9)",
    "        if(doneNP) {",
    "            if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "            if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "            if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "            if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "            doneN = abs(lumaEndN) >= gradientScaled;",
    "            doneP = abs(lumaEndP) >= gradientScaled;",
    "            if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P9;",
    "            if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P9;",
    "            doneNP = (!doneN) || (!doneP);",
    "            if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P9;",
    "            if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P9;",
    "/*--------------------------------------------------------------------------*/",
    "            #if (FXAA_QUALITY_PS > 10)",
    "            if(doneNP) {",
    "                if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                doneN = abs(lumaEndN) >= gradientScaled;",
    "                doneP = abs(lumaEndP) >= gradientScaled;",
    "                if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P10;",
    "                if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P10;",
    "                doneNP = (!doneN) || (!doneP);",
    "                if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P10;",
    "                if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P10;",
    "/*--------------------------------------------------------------------------*/",
    "                #if (FXAA_QUALITY_PS > 11)",
    "                if(doneNP) {",
    "                    if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                    if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                    if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                    if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                    doneN = abs(lumaEndN) >= gradientScaled;",
    "                    doneP = abs(lumaEndP) >= gradientScaled;",
    "                    if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P11;",
    "                    if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P11;",
    "                    doneNP = (!doneN) || (!doneP);",
    "                    if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P11;",
    "                    if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P11;",
    "/*--------------------------------------------------------------------------*/",
    "                    #if (FXAA_QUALITY_PS > 12)",
    "                    if(doneNP) {",
    "                        if(!doneN) lumaEndN = FxaaLuma(FxaaTexTop(tex, posN.xy));",
    "                        if(!doneP) lumaEndP = FxaaLuma(FxaaTexTop(tex, posP.xy));",
    "                        if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;",
    "                        if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;",
    "                        doneN = abs(lumaEndN) >= gradientScaled;",
    "                        doneP = abs(lumaEndP) >= gradientScaled;",
    "                        if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P12;",
    "                        if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P12;",
    "                        doneNP = (!doneN) || (!doneP);",
    "                        if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P12;",
    "                        if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P12;",
    "/*--------------------------------------------------------------------------*/",
    "                    }",
    "                    #endif",
    "/*--------------------------------------------------------------------------*/",
    "                }",
    "                #endif",
    "/*--------------------------------------------------------------------------*/",
    "            }",
    "            #endif",
    "/*--------------------------------------------------------------------------*/",
    "        }",
    "        #endif",
    "/*--------------------------------------------------------------------------*/",
    "    }",
    "    #endif",
    "/*--------------------------------------------------------------------------*/",
    "                        }",
    "                        #endif",
    "/*--------------------------------------------------------------------------*/",
    "                    }",
    "                    #endif",
    "/*--------------------------------------------------------------------------*/",
    "                }",
    "                #endif",
    "/*--------------------------------------------------------------------------*/",
    "            }",
    "            #endif",
    "/*--------------------------------------------------------------------------*/",
    "        }",
    "        #endif",
    "/*--------------------------------------------------------------------------*/",
    "    }",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat dstN = posM.x - posN.x;",
    "    FxaaFloat dstP = posP.x - posM.x;",
    "    if(!horzSpan) dstN = posM.y - posN.y;",
    "    if(!horzSpan) dstP = posP.y - posM.y;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaBool goodSpanN = (lumaEndN < 0.0) != lumaMLTZero;",
    "    FxaaFloat spanLength = (dstP + dstN);",
    "    FxaaBool goodSpanP = (lumaEndP < 0.0) != lumaMLTZero;",
    "    FxaaFloat spanLengthRcp = 1.0/spanLength;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaBool directionN = dstN < dstP;",
    "    FxaaFloat dst = min(dstN, dstP);",
    "    FxaaBool goodSpan = directionN ? goodSpanN : goodSpanP;",
    "    FxaaFloat subpixG = subpixF * subpixF;",
    "    FxaaFloat pixelOffset = (dst * (-spanLengthRcp)) + 0.5;",
    "    FxaaFloat subpixH = subpixG * fxaaQualitySubpix;",
    "/*--------------------------------------------------------------------------*/",
    "    FxaaFloat pixelOffsetGood = goodSpan ? pixelOffset : 0.0;",
    "    FxaaFloat pixelOffsetSubpix = max(pixelOffsetGood, subpixH);",
    "    if(!horzSpan) posM.x += pixelOffsetSubpix * lengthSign;",
    "    if( horzSpan) posM.y += pixelOffsetSubpix * lengthSign;",
    "    #if (FXAA_DISCARD == 1)",
    "        return FxaaTexTop(tex, posM);",
    "    #else",
    "        return FxaaFloat4(FxaaTexTop(tex, posM).xyz, lumaM);",
    "    #endif",
    "}",
    "/*==========================================================================*/",
    "#endif",
    "",
    "void main() {",
    "  gl_FragColor = FxaaPixelShader(",
    "    vUv,",
    "    vec4(0.0),",
    "    tDiffuse,",
    "    tDiffuse,",
    "    tDiffuse,",
    "    resolution,",
    "    vec4(0.0),",
    "    vec4(0.0),",
    "    vec4(0.0),",
    "    0.75,",
    "    0.166,",
    "    0.0833,",
    "    0.0,",
    "    0.0,",
    "    0.0,",
    "    vec4(0.0)",
    "  );",
    "",
    "  // TODO avoid querying texture twice for same texel",
    "  gl_FragColor.a = texture2D(tDiffuse, vUv).a;",
    "}"
  ].join("\n")

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Simple fake tilt-shift effect, modulating two pass Gaussian blur (see above) by vertical position
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 * - "r" parameter control where "focused" horizontal line lies
 */

export const HorizontalTiltShiftShader = {

  uniforms: {

    "tDiffuse": { value: null },
    "h":        { value: 1.0 / 512.0 },
    "r":        { value: 0.35 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float h;",
    "uniform float r;",

    "varying vec2 vUv;",

    "void main() {",

    "vec4 sum = vec4( 0.0 );",

    "float hh = h * abs( r - vUv.y );",

    "sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;",
    "sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;",
    "sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;",
    "sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
    "sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;",
    "sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;",
    "sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;",
    "sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;",

    "gl_FragColor = sum;",

    "}"

  ].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Simple fake tilt-shift effect, modulating two pass Gaussian blur (see above) by vertical position
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 * - "r" parameter control where "focused" horizontal line lies
 */

export const VerticalTiltShiftShader = {

  uniforms: {

    "tDiffuse": { value: null },
    "v":        { value: 1.0 / 512.0 },
    "r":        { value: 0.35 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float v;",
    "uniform float r;",

    "varying vec2 vUv;",

    "void main() {",

    "vec4 sum = vec4( 0.0 );",

    "float vv = v * abs( r - vUv.y );",

    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;",
    "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;",

    "gl_FragColor = sum;",

    "}"

  ].join( "\n" )

};


/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * ShaderToon currently contains:
 *
 *	toon1
 *	toon2
 *	hatching
 *	dotted
 */

export const ShaderToon = {

  'toon1' : {

    uniforms: {

      "uDirLightPos": { value: new THREE.Vector3() },
      "uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

      "uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

      "uBaseColor": { value: new THREE.Color( 0xffffff ) }

    },

    vertexShader: [

      "varying vec3 vNormal;",
      "varying vec3 vRefract;",

      "void main() {",

      "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "vec3 worldNormal = normalize ( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

      "vNormal = normalize( normalMatrix * normal );",

      "vec3 I = worldPosition.xyz - cameraPosition;",
      "vRefract = refract( normalize( I ), worldNormal, 1.02 );",

      "gl_Position = projectionMatrix * mvPosition;",

      "}"

    ].join( "\n" ),

    fragmentShader: [

      "uniform vec3 uBaseColor;",

      "uniform vec3 uDirLightPos;",
      "uniform vec3 uDirLightColor;",

      "uniform vec3 uAmbientLightColor;",

      "varying vec3 vNormal;",

      "varying vec3 vRefract;",

      "void main() {",

      "float directionalLightWeighting = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);",
      "vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

      "float intensity = smoothstep( - 0.5, 1.0, pow( length(lightWeighting), 20.0 ) );",
      "intensity += length(lightWeighting) * 0.2;",

      "float cameraWeighting = dot( normalize( vNormal ), vRefract );",
      "intensity += pow( 1.0 - length( cameraWeighting ), 6.0 );",
      "intensity = intensity * 0.2 + 0.3;",

      "if ( intensity < 0.50 ) {",

      "gl_FragColor = vec4( 2.0 * intensity * uBaseColor, 1.0 );",

      "} else {",

      "gl_FragColor = vec4( 1.0 - 2.0 * ( 1.0 - intensity ) * ( 1.0 - uBaseColor ), 1.0 );",

      "}",

      "}"

    ].join( "\n" )

  },

  'toon2' : {

    uniforms: {

      "uDirLightPos": { value: new THREE.Vector3() },
      "uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

      "uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

      "uBaseColor": { value: new THREE.Color( 0xeeeeee ) },
      "uLineColor1": { value: new THREE.Color( 0x808080 ) },
      "uLineColor2": { value: new THREE.Color( 0x000000 ) },
      "uLineColor3": { value: new THREE.Color( 0x000000 ) },
      "uLineColor4": { value: new THREE.Color( 0x000000 ) }

    },

    vertexShader: [

      "varying vec3 vNormal;",

      "void main() {",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "vNormal = normalize( normalMatrix * normal );",

      "}"

    ].join( "\n" ),

    fragmentShader: [

      "uniform vec3 uBaseColor;",
      "uniform vec3 uLineColor1;",
      "uniform vec3 uLineColor2;",
      "uniform vec3 uLineColor3;",
      "uniform vec3 uLineColor4;",

      "uniform vec3 uDirLightPos;",
      "uniform vec3 uDirLightColor;",

      "uniform vec3 uAmbientLightColor;",

      "varying vec3 vNormal;",

      "void main() {",

      "float camera = max( dot( normalize( vNormal ), vec3( 0.0, 0.0, 1.0 ) ), 0.4);",
      "float light = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);",

      "gl_FragColor = vec4( uBaseColor, 1.0 );",

      "if ( length(uAmbientLightColor + uDirLightColor * light) < 1.00 ) {",

      "gl_FragColor *= vec4( uLineColor1, 1.0 );",

      "}",

      "if ( length(uAmbientLightColor + uDirLightColor * camera) < 0.50 ) {",

      "gl_FragColor *= vec4( uLineColor2, 1.0 );",

      "}",

      "}"

    ].join( "\n" )

  },

  'hatching' : {

    uniforms: {

      "uDirLightPos":	{ value: new THREE.Vector3() },
      "uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

      "uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

      "uBaseColor":  { value: new THREE.Color( 0xffffff ) },
      "uLineColor1": { value: new THREE.Color( 0x000000 ) },
      "uLineColor2": { value: new THREE.Color( 0x000000 ) },
      "uLineColor3": { value: new THREE.Color( 0x000000 ) },
      "uLineColor4": { value: new THREE.Color( 0x000000 ) }

    },

    vertexShader: [

      "varying vec3 vNormal;",

      "void main() {",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "vNormal = normalize( normalMatrix * normal );",

      "}"

    ].join( "\n" ),

    fragmentShader: [

      "uniform vec3 uBaseColor;",
      "uniform vec3 uLineColor1;",
      "uniform vec3 uLineColor2;",
      "uniform vec3 uLineColor3;",
      "uniform vec3 uLineColor4;",

      "uniform vec3 uDirLightPos;",
      "uniform vec3 uDirLightColor;",

      "uniform vec3 uAmbientLightColor;",

      "varying vec3 vNormal;",

      "void main() {",

      "float directionalLightWeighting = max( dot( normalize(vNormal), uDirLightPos ), 0.0);",
      "vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

      "gl_FragColor = vec4( uBaseColor, 1.0 );",

      "if ( length(lightWeighting) < 1.00 ) {",

      "if ( mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {",

      "gl_FragColor = vec4( uLineColor1, 1.0 );",

      "}",

      "}",

      "if ( length(lightWeighting) < 0.75 ) {",

      "if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {",

      "gl_FragColor = vec4( uLineColor2, 1.0 );",

      "}",
      "}",

      "if ( length(lightWeighting) < 0.50 ) {",

      "if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {",

      "gl_FragColor = vec4( uLineColor3, 1.0 );",

      "}",
      "}",

      "if ( length(lightWeighting) < 0.3465 ) {",

      "if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {",

      "gl_FragColor = vec4( uLineColor4, 1.0 );",

      "}",
      "}",

      "}"

    ].join( "\n" )

  },

  'dotted' : {

    uniforms: {

      "uDirLightPos":	{ value: new THREE.Vector3() },
      "uDirLightColor": { value: new THREE.Color( 0xeeeeee ) },

      "uAmbientLightColor": { value: new THREE.Color( 0x050505 ) },

      "uBaseColor":  { value: new THREE.Color( 0xffffff ) },
      "uLineColor1": { value: new THREE.Color( 0x000000 ) }

    },

    vertexShader: [

      "varying vec3 vNormal;",

      "void main() {",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "vNormal = normalize( normalMatrix * normal );",

      "}"

    ].join( "\n" ),

    fragmentShader: [

      "uniform vec3 uBaseColor;",
      "uniform vec3 uLineColor1;",
      "uniform vec3 uLineColor2;",
      "uniform vec3 uLineColor3;",
      "uniform vec3 uLineColor4;",

      "uniform vec3 uDirLightPos;",
      "uniform vec3 uDirLightColor;",

      "uniform vec3 uAmbientLightColor;",

      "varying vec3 vNormal;",

      "void main() {",

      "float directionalLightWeighting = max( dot( normalize(vNormal), uDirLightPos ), 0.0);",
      "vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;",

      "gl_FragColor = vec4( uBaseColor, 1.0 );",

      "if ( length(lightWeighting) < 1.00 ) {",

      "if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {",

      "gl_FragColor = vec4( uLineColor1, 1.0 );",

      "}",

      "}",

      "if ( length(lightWeighting) < 0.50 ) {",

      "if ( ( mod(gl_FragCoord.x + 2.0, 4.001) + mod(gl_FragCoord.y + 2.0, 4.0) ) > 6.00 ) {",

      "gl_FragColor = vec4( uLineColor1, 1.0 );",

      "}",

      "}",

      "}"

    ].join( "\n" )

  }

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

export const CopyShader = {

  uniforms: {

    "tDiffuse": { value: null },
    "opacity":  { value: 1.0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform float opacity;",

    "uniform sampler2D tDiffuse;",

    "varying vec2 vUv;",

    "void main() {",

    "vec4 texel = texture2D( tDiffuse, vUv );",
    "gl_FragColor = opacity * texel;",

    "}"

  ].join( "\n" )

};


export const ClearMaskPass = function () {

  Pass.call( this );

  this.needsSwap = false;

};

ClearMaskPass.prototype = Object.create( Pass.prototype );

Object.assign( ClearMaskPass.prototype, {

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    renderer.state.buffers.stencil.setTest( false );

  }

} );