const soundcloudClientId = "ad6375f4b6bc0bcaee8edf53ab37e7f2"; // 😄
const soundcloudApiUrl = "https://api.soundcloud.com/tracks";

export const formatSoundcloudSrc = (trackId, secretToken=null) => {
  let url = `${soundcloudApiUrl}/${trackId}/stream?client_id=${soundcloudClientId}`;
  if (secretToken) {
    url += `&secret_token=${secretToken}`
  }
  return url;
}

export const soundcloudTrackIdFromSrc = (src) => {
  return  src.split(soundcloudApiUrl)[1].split("/")[1];
}

