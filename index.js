const electron = window.require("electron").remote;
const browserWindow = window.require('electron').remote.getCurrentWindow()
const fs = require('fs');

async function downloadInstPhotos() {
    const instUserNmae = document.getElementById("username").value;
    if (!instUserNmae) return;
    const { filePaths } = await electron.dialog.showOpenDialog(browserWindow, {properties: ['openDirectory']});
    const pathToSave = filePaths.pop();
    fs.writeFileSync(`${pathToSave}/test.txt`, 'instUserNmae');
}
