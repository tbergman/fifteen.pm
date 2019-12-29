import React, { useEffect, useState } from "react";
import { CONTENT } from "../../Content";
import UI from "../../UI/UI";
import AlienDCanvas from "./Canvas";

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
