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
          type="text"
          className="instagram-username"
          placeholder="instagram username"
          value={username}
          onChange={this.handleUserNameChange}
        />
        <button className="download-btn" onClick={this.downloadInstPhotos}>Download Profile Photo</button>
      </div>
    );
  }
}

export default App;
