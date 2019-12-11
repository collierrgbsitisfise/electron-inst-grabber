const electron = window.require("electron").remote;
const browserWindow = window.require('electron').remote.getCurrentWindow()
const fs = require('fs');
const Grabber = require('./services/grabber');
const downloadImageByLink = require('./utils/download-image-by-link');

async function downloadInstPhotos() {
    console.log('downloadImageByLink : ', downloadImageByLink);
    const instUserNmae = document.getElementById("username").value;
    if (!instUserNmae) return;
    const { filePaths } = await electron.dialog.showOpenDialog(browserWindow, {properties: ['openDirectory']});
    const pathToSave = filePaths.pop();

    const grabber = new Grabber(instUserNmae);
    await grabber.lunchPuppeter();
    await grabber.evaluate();

    const parsedLinks = grabber.getItems();
    console.log(';parsedLinks');
    console.log(parsedLinks);

    let inc = 1;
    for (const link of parsedLinks) {
        const res = await downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`);
        console.log(res);
    }
    // fs.writeFileSync(`${pathToSave}/test.json`, JSON.stringify(grabber.buildJSON()));
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