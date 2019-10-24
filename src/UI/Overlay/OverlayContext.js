// import React, { useState, useMemo } from 'react';

// const OverlayContext = React.createContext([{}, () => {}]);

// const OverlayProvider = (props) => {
//   const loadedTracks = useMemo(() => {})
//   const [state, setState] = useState({
//     isOpen: props.isOpen || true,
    
//     tracks: loadedTracks,
//     currentTrackIndex: null,
//     isPlaying: false,
//   });
//   return (
//     <OverlayContext.Provider value={[state, setState]}>
//       {props.children}
//     </OverlayContext.Provider>
//   );
// };

// export { OverlayContext, OverlayProvider };