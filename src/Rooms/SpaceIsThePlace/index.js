import React, { useMemo , useState} from "react";
import { CONTENT } from "../../Content";
import UI from "../../UI/UI";
import SpaceIsThePlaceCanvas from "./Canvas";
import "./index.css";

export default function Room_SpaceIsThePlace({}) {
  const content = useMemo(() => CONTENT[window.location.pathname]);
  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);

  return (
    <>
      <UI
        content={content}
        renderPlayer={false}
        loadWithNavigation={false}
        onOverlayHasBeenClosed={() => setHasEnteredWorld(true)}
      />
      <SpaceIsThePlaceCanvas content={content} hasEnteredWorld={hasEnteredWorld}/>
    </>
  );
}
