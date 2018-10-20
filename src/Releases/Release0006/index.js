import React, {Component, Fragment} from 'react';
import {CONTENT} from "../../Main/Content";
import Footer from '../../Main/Footer/Footer';

class Release0006 extends Component {
    render() {
        return (
            <Fragment>
                <div ref={element => this.container = element}/>
                <Footer
                    content={CONTENT[window.location.pathname]}
                    fillColor="white"
                    audioRef={el => this.audioElement = el}
                />
            </Fragment>
        );
    }
}

export default Release0006;
