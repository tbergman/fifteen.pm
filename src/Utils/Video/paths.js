export const multiSourceVideo = (path) => ([
    { type: 'video/mp4', src: `${path}.mp4` },
    { type: 'video/webm', src: `${path}.webm` }
]);


export const YoutubeLiveStreamVideo = (path) => ([
  { type: 'video/mp4', src: `${path}.mp4` },
  { type: 'video/webm', src: `${path}.webm` }
]);