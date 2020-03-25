import React, { Fragment } from 'react';
import { CONTENT } from '../Content';
import '../Releases/Release.css';
import UI from '../Common/UI/UI';
import { HomeDefaultCanvas } from './HomeDefaultCanvas';
import { ReleaseList } from './ReleaseList';

export default function HomeDefault(props) {  
  return (
    <Fragment>
      <UI content={CONTENT["/"]} loadWithOverlay={false} />
      <ReleaseList />
      <HomeDefaultCanvas />
    </Fragment>
  );
}
