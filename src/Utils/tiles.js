// we cut off the floating point length here to insure 99% match, i.e. for use with kdTree model (since the model can change the exact value a bit)
export const tileId = ({x, y, z}) => [x.toFixed(3), y.toFixed(3), z.toFixed(3)].join("_");

export const tileIdFrom2d = ({ x, z }) => tileId({x, y: 0, z})



