const electron = window.require("electron").remote;
const browserWindow = window.require('electron').remote.getCurrentWindow()
const Grabber = require('./services/grabber');
const downloadImageByLink = require('./utils/download-image-by-link');

async function downloadInstPhotos() {
    const instUserNmae = document.getElementById("username").value;
    if (!instUserNmae) return;
    const { filePaths } = await electron.dialog.showOpenDialog(browserWindow, {properties: ['openDirectory']});
    const pathToSave = filePaths.pop();

    const grabber = new Grabber(instUserNmae);
    await grabber.lunchPuppeter();
    await grabber.evaluate();

    const parsedLinks = grabber.getItems();

    let inc = 1;
    for (const link of parsedLinks) {
        const res = await downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`);
    }
}
