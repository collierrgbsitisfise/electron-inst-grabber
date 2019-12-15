const { Grabber } = require('./../services');
const { downloadImageByLink } = require('./../utils');

const grabbPhotos = async (e, { pathToSave, instUserNmae }) => {
    // @TODO handle error
    const grabber = new Grabber(instUserNmae);
    await grabber.lunchPuppeter();
    await grabber.evaluate();

    const parsedLinks = grabber.getItems();

    let inc = 1;
    for (const link of parsedLinks) {
        const res = await downloadImageByLink(link, pathToSave, `${instUserNmae}-${inc++}`);
    }
}

module.exports = grabbPhotos;