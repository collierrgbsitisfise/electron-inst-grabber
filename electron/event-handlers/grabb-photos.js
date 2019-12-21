const { Grabber } = require('./../services');

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

    mainWindow.send('success', {
        msg: `photos was parsed and saved: ${pathToSave}`,
    });
}

module.exports = grabbPhotos;
