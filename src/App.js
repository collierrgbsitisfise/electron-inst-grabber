import React, { Component } from 'react';
import './App.css';

const electron = window.require('electron').remote;
const ipcRenderer = window.require('electron').ipcRenderer;
const browserWindow = window.require('electron').remote.getCurrentWindow()


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { username: '', progress: 0, showProgress: false, showPreloader: false }
    this.handleEvents();
  }

  handleEvents() {

    ipcRenderer.on('updateProgress', (e, value) => {
      this.setState(state => ({
        ...state,
        progress: value,
      }));
    });

    ipcRenderer.on('showPreloader', (e, data) => {
      this.setState(state => ({
        ...state,
        showPreloader: true,
      }));
    });

    ipcRenderer.on('hidePreloader', (e, data) => {
      this.setState(state => ({
        ...state,
        showPreloader: false,
      }));
    });

    ipcRenderer.on('startDownload', (e, data) => {
      this.setState(state => ({
        ...state,
        showProgress: true,
      }));
    });

    ipcRenderer.on('finishDownload', (e, data) => {
      this.setState(state => ({
        ...state,
        showProgress: false,
      }));
    });
  
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

  renderProgressBar = (value, max) => {
    return (
      <progress className="amount-progress" value={value} max={max}></progress>
    );
  }


  renderPreloader = () => {
    return (
      <div className="progress-horizontal">
        <div className="bar-horizontal"></div>
      </div>
    )
  }

  render() {
    const { username, progress, showProgress, showPreloader } = this.state;
    console.log('progress : ', progress);
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
        {showPreloader && this.renderPreloader()}
        {showProgress && this.renderProgressBar(progress, 100)}
      </div>
    );
  }
}

export default App;
