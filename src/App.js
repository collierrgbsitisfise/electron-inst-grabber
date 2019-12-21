import React, { Component } from 'react';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

import './App.css';

const electron = window.require('electron').remote;
const ipcRenderer = window.require('electron').ipcRenderer;
const browserWindow = window.require('electron').remote.getCurrentWindow()


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        progress: 0,
        showProgress: false,
        showPreloader: false,
        preloaderText: '',
    }
    this.handleEvents();
  }

  handleEvents() {

    ipcRenderer.on('updateProgress', (e, value) => {
      this.setState(state => ({
        ...state,
        progress: value,
        preloaderText: `was parsed ${value >= 100 ? 100 : value}%`
      }));
    });

    ipcRenderer.on('showPreloader', (e, data) => {
      this.setState(state => ({
        ...state,
        showPreloader: true,
        preloaderText: data,
      }));
    });

    ipcRenderer.on('hidePreloader', (e, data) => {
      this.setState(state => ({
        ...state,
        showPreloader: false,
        preloaderText: '',
      }));
    });

    ipcRenderer.on('startDownload', (e, data) => {
      this.setState(state => ({
        ...state,
        showProgress: true,
        preloaderText: data
      }));
    });

    ipcRenderer.on('finishDownload', (e, data) => {
      this.setState(state => ({
        ...state,
        showProgress: false,
        preloaderText: '',
      }));
    });
    
    ipcRenderer.on('error', (e, { msg }) => {
      ToastsStore.error(msg, 6000);
      this.setState(state => ({
        username: '',
        progress: 0,
        showProgress: false,
        showPreloader: false,
        preloaderText: '',
      }));
    });

    ipcRenderer.on('success', (e, { msg }) => {
      ToastsStore.success(msg, 6000);
      this.setState(state => ({
        username: '',
        progress: 0,
        showProgress: false,
        showPreloader: false,
        preloaderText: '',
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

    if (!pathToSave) {
      return;
    }

    ipcRenderer.send('grabbPhotos', { pathToSave, instUserNmae: username });
  }

  renderProgressBar = (value, max) => {
    return (
      <progress className="amount-progress" value={value} max={max}></progress>
    );
  }


  renderPreloader = () => {
    return (
      <>
        <div className="progress-horizontal">
          <div className="bar-horizontal"></div>
        </div>
      </>
    )
  }

  renderLoaderTextInfo = (text) => {
    return (
      <h4 className="preloader-text">{text}</h4>
    )
  }

  render() {
    const { username, progress, showProgress, showPreloader, preloaderText } = this.state;
    const isLoading = showPreloader || showProgress;

    return (
      <div className="container">
        <input
          className={`input ${isLoading && 'disabled'}`}
          type="text"
          placeholder="username"
          value={username}
          onChange={this.handleUserNameChange}
        />

        <div className={`button ${(isLoading || !username) && 'disabled'}`} onClick={this.downloadInstPhotos}>
          <span>Download</span>
          <svg>
            <polyline className="o1" points="0 0, 150 0, 150 55, 0 55, 0 0"></polyline>
            <polyline className="o2" points="0 0, 150 0, 150 55, 0 55, 0 0"></polyline>
          </svg>
        </div>
        {isLoading && this.renderLoaderTextInfo(preloaderText)}
        {showPreloader && this.renderPreloader()}
        {showProgress && this.renderProgressBar(progress, 100)}


        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_LEFT}/>
      </div>
    );
  }
}

export default App;
