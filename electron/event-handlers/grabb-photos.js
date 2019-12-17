const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');


const grabbPhotos = (mainWindow) => async (e, { pathToSave, instUserNmae }) => {
    console.log('mainWindow : ', mainWindow);
    mainWindow.send('showPreloader');
    // @TODO handle error
    const grabber = new Grabber(instUserNmae, mainWindow);
    await grabber.lunchPuppeter();
    const totalNumberOfPosts = await grabber.getNumberOfPosts();
    mainWindow.send('hidePreloader');

    mainWindow.send('startDownload');
    await grabber.evaluate(+totalNumberOfPosts);
    mainWindow.send('finishDownload');

    mainWindow.send('showPreloader');
    const parsedLinks = grabber.getItems();

    let inc = 1;
    const chankSize = 100;
    let chankArr = [];
    for (const link of parsedLinks) {

        if (chankArr.length === chankSize) {
            await Promise.all(chankArr);
            chankArr = [];
            continue;
        }

        chankArr.push(downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`));
    }

    await Promise.all(chankArr);
    mainWindow.send('hidePreloader');
}

module.exports = grabbPhotos;