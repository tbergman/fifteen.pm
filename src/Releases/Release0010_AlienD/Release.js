import React, { useEffect, useState, Component} from "react";
import { CONTENT } from "../../Content";
import UI from "../../Common/UI/UI";
import AlienDCanvas from "./Canvas";

// Functional version
export default function Release({}) {
  const [content, setContent] = useState(false);

  useEffect(() => {
    setContent(CONTENT[window.location.pathname]);
  }, []);

  return (
    <>
      {content && (
        <>
          <UI content={content} />
          <AlienDCanvas />
        </>
      )}
    </>
  );
}