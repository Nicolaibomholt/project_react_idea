import logo from './logo.svg';
import './App.css';
import SkeletFunc from './Functions/SkeletFunc';
import SkeletClass from './Classes/SkeletClass'
import React, { Component } from 'react'


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <SkeletFunc></SkeletFunc>
          <SkeletClass></SkeletClass>
        </header>
      </div>
    );
  }
}

