const electron = require("electron");
const ipcMain = require('electron').ipcMain;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const { Grabber } = require('./services');
const { downloadImageByLink } = require('./utils');

let mainWindow;

require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true }});
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
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

ipcMain.on('pathUpdate', async (e, { pathToSave, instUserNmae }) => {
  console.log(pathToSave);
  const grabber = new Grabber(instUserNmae);
  await grabber.lunchPuppeter();
  await grabber.evaluate();

  const parsedLinks = grabber.getItems();

  let inc = 1;
  for (const link of parsedLinks) {
      const res = await downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`);
  }
});