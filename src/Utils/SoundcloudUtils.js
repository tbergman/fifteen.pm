const soundcloudClientId = "ad6375f4b6bc0bcaee8edf53ab37e7f2"; // 😄
const soundcloudApiUrl = "https://api.soundcloud.com/tracks";

export const formatSoundcloudSrc = (trackId, secretToken) => {
  let url = `${soundcloudApiUrl}/${trackId}/stream?client_id=${soundcloudClientId}`;
  if (secretToken !== undefined) {
    url += `&secret_token=${secretToken}`
  }
  return url;
}

