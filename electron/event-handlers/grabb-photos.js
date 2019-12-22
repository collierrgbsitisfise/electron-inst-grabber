const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');

const grabbPhotos = (mainWindow) => async (e, { pathToSave, instUserNmae }) => {
    mainWindow.send('showPreloader', 'Preparing to parsing...');
    const grabber = new Grabber(instUserNmae, mainWindow, pathToSave);

    try {
        await grabber.lunchPuppeter();
    } catch (err) {
        console.log('ERROR: luchPuppeter');
        console.log(err);
        mainWindow.send('hidePreloader');
        mainWindow.send('error', {
            msg: 'invalid user name or profile itself is private !',
        });
        return;
    }
    mainWindow.send('hidePreloader');

    mainWindow.send('startDownload');
    try {
        const totalNumberOfPosts = await grabber.getNumberOfPosts();
    
        await grabber.evaluate(+(totalNumberOfPosts.replace(/\D/g, "")));
    } catch (err) {
        console.log('ERROR: evaluate');
        console.log(err);
        mainWindow.send('error', {
            msg: 'parsing problems try one more time',
        });
        return;
    }
    mainWindow.send('finishDownload');


    mainWindow.send('showPreloader', 'Save photos...');
    try {
        const media = grabber.getItems();
        const chnakSize = 100;
        let chankArr = [];
        
        console.log('SIZE', media.size)
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
    } catch (err) {
        console.log('ERROR: downalod photos');
        console.log(err);
        mainWindow.send('error', {
            msg: 'parsing with saving photos try one more time',
        });
    }
    mainWindow.send('hidePreloader');

    mainWindow.send('success', {
        msg: `photos was parsed and saved: ${pathToSave}`,
    });
}

module.exports = grabbPhotos;
