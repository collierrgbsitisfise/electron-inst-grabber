const electron = require("electron");
const ipcMain = require('electron').ipcMain;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const { grabbPhotos } = require('./event-handlers');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 750, height: 650, webPreferences: { nodeIntegration: true }, resizable: false });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  ipcMain.on('grabbPhotos', grabbPhotos(mainWindow));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
