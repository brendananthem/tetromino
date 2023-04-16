const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/index.html');
    // The browser will stay open until you close it manually.
    // You can add any automation you want here.
})();