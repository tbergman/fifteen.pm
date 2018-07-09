import React, { Component } from 'react';
import pure from 'recompose/pure';

class Logo extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {onClick} = this.props;
    return (
      <div className="logo-wrapper"
           onClick={onClick}>
        <div id="logo-light" />
        <svg width="75" height="75" viewBox="-1.2 -1.2 2.2 2.2">
          <g fill="none" stroke="hsla(255,255%,255%,.52)" strokeWidth="0.01">
            <circle r="1"/>
            <g id="grid">
              <path d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-1.0s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-1.5s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path  d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-2.0s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-2.5s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path  d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-3.0s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path  d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-3.5s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-4.0s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path  d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-4.5s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
              <path d="M0 1A1 1 0 0 1 0-1">
                <animateTransform attributeName="transform" type="scale" begin="-5.0s" dur="6s" values="1 1; -1 1" repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
              </path>
            </g>
            <use href="#grid" transform="rotate(-65)"/>
          </g>
        </svg>
      </div>
    );
  }
}

export default pure(Logo);
