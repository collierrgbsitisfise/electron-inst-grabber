const electron = window.require("electron").remote;
const browserWindow = window.require('electron').remote.getCurrentWindow()
const fs = require('fs');
const Grabber = require('./services/grabber');

async function downloadInstPhotos() {
    const instUserNmae = document.getElementById("username").value;
    if (!instUserNmae) return;
    const { filePaths } = await electron.dialog.showOpenDialog(browserWindow, {properties: ['openDirectory']});
    const pathToSave = filePaths.pop();

    const grabber = new Grabber(instUserNmae);
    console.log('1');
    await grabber.lunchPuppeter();
    console.log('2');
    await grabber.evaluate();
    console.log('3');
    fs.writeFileSync(`${pathToSave}/test.json`, JSON.stringify(grabber.buildJSON()));
}

// crujka_joe

// const Grabber = require('./grabber');

// const path = process.argv[2];

// (async () => {
//     const grabber = new Grabber(path);
//     await grabber.lunchPuppeter();
//     await grabber.evaluate();

//     console.log('grabbed items');
//     console.log(grabber.getItems());
//     grabber.buildJSON();
// })();