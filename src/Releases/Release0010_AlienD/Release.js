import React, { useEffect, useState, Component} from "react";
import { CONTENT } from "../../Content";
import UI from "../../Common/UI/UI";
import AlienDCanvas from "./Canvas";

// // Uncomment for class version
// import { renderScene } from './sceneJV';
// export default class Release extends Component {

//   componentDidMount = () => {
//     this.container && renderScene(this.container);
//   }

//   render = () => (
//       <>
//         <UI content={CONTENT[window.location.pathname]} />
//         <div ref={element => this.container = element}/> */}
//       </>
//     );
// };

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