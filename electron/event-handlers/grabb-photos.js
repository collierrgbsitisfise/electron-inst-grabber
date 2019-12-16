const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');

const grabbPhotos = async (e, { pathToSave, instUserNmae }) => {
    // @TODO handle error
    const grabber = new Grabber(instUserNmae);
    await grabber.lunchPuppeter();
    await grabber.evaluate();

    const parsedLinks = grabber.getItems();

    let inc = 1;
    const chankSize = 100;
    const chankArr = [];
    for (const link of parsedLinks) {

        if (chankArr.length === chankSize) {
            await Promise.all(chankArr);
            chankArr = [];
            continue;
        }

        chankArr.push(downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`));
    }

    await Promise.all(chankArr);
}

module.exports = grabbPhotos;