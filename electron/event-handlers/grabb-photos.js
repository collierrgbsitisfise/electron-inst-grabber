const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');


const grabbPhotos = (mainWindow) => async (e, { pathToSave, instUserNmae }) => {
    console.log('mainWindow : ', mainWindow);
    mainWindow.send('showPreloader', 'Preparing to parsing...');
    // @TODO handle error
    const grabber = new Grabber(instUserNmae, mainWindow);
    await grabber.lunchPuppeter();
    const totalNumberOfPosts = await grabber.getNumberOfPosts();
    console.log('totalNumberOfPosts');
    console.log(totalNumberOfPosts.replace(/\D/g, ""));
    mainWindow.send('hidePreloader');

    mainWindow.send('startDownload');
    await grabber.evaluate(+(totalNumberOfPosts.replace(/\D/g, "")));
    mainWindow.send('finishDownload');

    mainWindow.send('showPreloader', 'Download to parsed pahotos...');
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