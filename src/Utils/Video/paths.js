export const multiSourceVideo = (path) => ([
    { type: 'video/mp4', src: `${path}.mp4` },
    { type: 'video/webm', src: `${path}.webm` }
]);