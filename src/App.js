import React, { Component } from 'react';
import './App.css';

const electron = window.require('electron').remote;
const ipcRenderer = window.require('electron').ipcRenderer;
const browserWindow = window.require('electron').remote.getCurrentWindow()


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { username: '' }
  }

  handleUserNameChange = event => {
    this.setState({ username: event.target.value });
  };

  downloadInstPhotos = async () => {
    const { username } = this.state;

    if (!username) return;

    const { filePaths } = await electron.dialog.showOpenDialog(browserWindow, {properties: ['openDirectory']});
    const pathToSave = filePaths.pop();

    ipcRenderer.send('grabbPhotos', { pathToSave, instUserNmae: username });
  }

  render() {
    const { username } = this.state;
    return (
      <div className="container">
        <input
          className="input"
          type="text"
          placeholder="username"
          value={username}
          onChange={this.handleUserNameChange}
        />

        <div className="button" onClick={this.downloadInstPhotos}>
          <span>Download</span>
          <svg>
            <polyline className="o1" points="0 0, 150 0, 150 55, 0 55, 0 0"></polyline>
            <polyline className="o2" points="0 0, 150 0, 150 55, 0 55, 0 0"></polyline>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
