const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');

const grabbPhotos = (mainWindow) => async (e, { pathToSave, instUserNmae }) => {
    mainWindow.send('showPreloader', 'Preparing to parsing...');
    const grabber = new Grabber(instUserNmae, mainWindow, pathToSave);

    try {
        await grabber.lunchPuppeter();
    } catch (err) {
        console.log('ERROR');
        console.log(err);
        mainWindow.send('hidePreloader');
        mainWindow.send('error', {
            msg: 'invalid user name or profile itself is private !',
        });
        return;
    }

    const totalNumberOfPosts = await grabber.getNumberOfPosts();
    mainWindow.send('hidePreloader');

    mainWindow.send('startDownload');
    await grabber.evaluate(+(totalNumberOfPosts.replace(/\D/g, "")));
    mainWindow.send('finishDownload');

    mainWindow.send('showPreloader', 'Save photos...');
    const media = grabber.getItems();
    const chnakSize = 100;
    let chankArr = [];

    for (const [i, link] of Array.from(media).entries()) {

        if (Number.isInteger(i / chnakSize)) {
            await Promise.all(chankArr);
            chankArr = [];
            chankArr.push(downloadImageByLink(link, pathToSave, `${instUserNmae}-${i + 1}`));
            continue;
        }
        chankArr.push(downloadImageByLink(link, pathToSave, `${instUserNmae}-${i + 1}`));
    }
  
    await Promise.all(chankArr);
    mainWindow.send('hidePreloader');

    mainWindow.send('success', {
        msg: `photos was parsed and saved: ${pathToSave}`,
    });
}

module.exports = grabbPhotos;
