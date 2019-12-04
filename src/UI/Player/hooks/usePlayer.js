import useVideoPlayer from "./useVideoPlayer"
import useAudioPlayer from "./useAudioPlayer";

const usePlayer = (mediaType) => {
    if (mediaType == "video") return useVideoPlayer();
    else return useAudioPlayer();
}

export default usePlayer;