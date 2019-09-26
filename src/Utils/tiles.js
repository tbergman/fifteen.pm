// we cut off the floating point length here to insure 99% match, i.e. for use with kdTree model (since the model can change the exact value a bit)
export const tileId = (centroid) => [centroid.x.toFixed(3), centroid.y.toFixed(3), centroid.z.toFixed(3)].join("_");
