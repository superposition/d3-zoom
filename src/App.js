import React, { Component } from 'react';
import Tiles from './Tiles';

export default class App extends Component {
  render() {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    };
    const headerStyle = {
      height: '40px',
      margin: '10px'
    };
    const linkStyle = {
      color: 'rgb(255, 1, 175)',
      textDecoration: 'none'
    };

    return (
      <div style={ containerStyle }>
        <h1 style={ headerStyle }>
          <a href="https://texel.space/tiles" target="_blank" style={ linkStyle }>TexelTiles</a>
        </h1>
        <Tiles />
      </div>
    );
  }
}
