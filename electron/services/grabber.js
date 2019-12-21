const puppeteer = require('puppeteer');
const fs = require(`fs`);
const { downloadImageByLink } = require('./../utils');


class Grabber {
  constructor(path = `instagram`, mainWindow, pathToSave, host = `https://instagram.com/`, numberOfPhotos = Infinity) {
    this.path = path;
    this.host = host;
    this.numberOfPhotos = numberOfPhotos;
    this.mainWindow = mainWindow;
    this.pathToSave = pathToSave;
  }

  get url() {
    return `${this.host}${this.path}`;
  }
  
  getItems() {
    return this.items;
  }

  async getNumberOfPosts() {
    const page = this.page;

    const spanWithInfo = await page.$('span.g47SY ');
    return (await spanWithInfo.getProperty('textContent')).jsonValue();
  }

  async lunchPuppeter() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US"
    });

    await this.page.goto(this.url, {
      waitUntil: `networkidle0`
    });

    if (await this.page.$(`.dialog-404`)) {
      throw Error(`invalid url address: ${this.url}`);
    }
  }

  async evaluate(numberOfPhotos) {
    try {
      this.items = await this.load(numberOfPhotos);
    } catch (error) {
      console.error(`There was a problem parsing the page`);
      console.error(error);
      process.exit(1);
    }

    console.log(`was scarped ${this.items.size} photos`);

    await this.page.close();
    await this.browser.close();
  }

  async load(maxItemsSize) {
    console.log('RECEIVE : ',maxItemsSize);
    this.maxItemsSize = maxItemsSize;
    let previousHeight;
    let currentScrollHeight;
    let chankArr = [];
    let inc = 1;

    const page = this.page;
    const media = new Set();

    this.mainWindow.send('updateProgress', 0);
    while (maxItemsSize == null || media.size < maxItemsSize) {
      try {
        previousHeight = await page.evaluate(`document.body.scrollHeight`);
        await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);

        try {
          await page.waitForFunction(
            `document.body.scrollHeight > ${previousHeight}`
          );
        } catch (e) {}

        await page.waitFor(1000);

        console.log('grabbing...');

        const nodes = await page.evaluate(() => {
          const images = document.querySelectorAll(`a > div > div.KL4Bh > img`);
          return [].map.call(images, img => img.src);
        });

        const percentage = Math.trunc(100 * (media.size + nodes.length) / maxItemsSize);
        this.mainWindow.send('updateProgress', percentage);
        nodes.forEach(element => {
          if (media.size < maxItemsSize) {
            media.add(element);
          }
        });


        currentScrollHeight = await page.evaluate(`document.body.scrollHeight`);

        if (currentScrollHeight === previousHeight) {
          break;
        }
      } catch (error) {
        console.error(error);
        break;
      }
    }

    for (const link of Array.from(media)) {
      chankArr.push(downloadImageByLink(link, this.pathToSave, `${this.path}-${inc++}`));
    }

    await Promise.all(chankArr);
    return media;
  }

  buildJSON() {
    const tmp = [];
    this.items.forEach(url => {
      tmp.push(url);
    });
    console.log('file was created')
    fs.writeFileSync("grabbed.json", JSON.stringify(tmp));
  }
}

module.exports = Grabber;