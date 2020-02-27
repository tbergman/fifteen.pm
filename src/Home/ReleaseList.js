import React from 'react';
import '../Releases/Release.css';

export function ReleaseList(props) {
    return <div className="releases-list">
        <ul>
            <li> Releases </li>
            <li><a href="/1">Yahceph</a></li>
            <li><a href="/2">Year Unknown</a></li>
            <li><a href="/3">Othere</a></li>
            <li><a href="/4">Jon Cannon</a></li>
            <li><a href="/5">Plebeian</a></li>
            <li><a href="/6">vveiss</a></li>
            <li><a href="/7">Jon Fay</a></li>
            <li><a href="/8">Greem Jellyfish</a></li>
            <li><a href="/9">Javonntte</a></li>
        </ul>
    </div>;
}