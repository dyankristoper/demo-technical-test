const puppeteer = require('puppeteer');
const cheerio   = require("cheerio");
const axios     = require("axios");
const fs = require('fs');

const scrapeIframePuppeteer = async ( url ) => {
    let logs = [];

    const browser = await puppeteer.launch({
        headless: true
    });

    // Store the endpoint to be able to reconnect to the browser.
    // const browserWSEndpoint = browser.wsEndpoint();
    // console.log("Browser WS Endpoint", browserWSEndpoint);
    // // Disconnect puppeteer from the browser.
    browser.disconnect();

    // Use the endpoint to reestablish a connection
    const browserToConnect = await puppeteer
                            .connect({browserWSEndpoint : url})
                            .catch((error) => console.error(error));

    const pages = await browserToConnect.pages();
    const page = pages[0];

    console.log( await page.content() );

    await page.screenshot({ path: 'screenshot.png' });

    // await page.waitForSelector('iframe');
    // const iframe = await page.$('#twilio-iframe');
    // const iframeContent = await iframe.contentFrame();
    // const evaluatedLogs = await iframeContent.$('#logs > li');
    // console.log( evaluatedLogs );

    // Close the browser.
    await browserToConnect.close();

    return logs;
}

const scrapeIframeCheerio = async () => {
    const twilioTestUrl = "https://networktest.twilio.com/";

    const response = await axios.get( twilioTestUrl );


    return new Promise( ( resolve ) => {
        setTimeout(() => {
            const $ = cheerio.load( response?.data );

            console.log( response?.data );
        
            $("#logs > li").each( log => {
                console.log( "Log:", log );
            });
        
            resolve([]);
        }, 10000);
    });
}

const scrapeIframe = async () => {
    // OPTION 1 - Launch new.
    const browser = await puppeteer.launch({
        headless: false, // Puppeteer is 'headless' by default.
    });

    // OPTION 2 - Connect to existing.
    // MAC: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
    // PC: start chrome.exe –remote-debugging-port=9222
    // Note: this url changes each time the command is run.
    // const wsChromeEndpointUrl = 'ws://127.0.0.1:9222/devtools/browser/1d62a028-feb3-44c6-a46e-3de8bfaaad56';
    // const browser = await puppeteer.connect({
    //     browserWSEndpoint: wsChromeEndpointUrl,
    // });

    const page = await browser.newPage();
    let pageUrl = 'https://caniuse.com/';

    await page.goto(pageUrl, {
        waitUntil: 'networkidle0', // 'networkidle0' is very useful for SPAs.
    });
    await page.screenshot({ path: 'screenshot.png' });

    const mostSearchedList = await page.evaluate(() => {
        const objectList = document.querySelectorAll(
        '.js-most-searched .home__list-item'
        );
        const mostSearched = [];

        objectList.forEach((item) => {
        const child = item.firstChild;
        const title = child.innerText;
        const href = child.href;

        mostSearched.push(title + ' - ' + href);
        });

        return mostSearched;
    });

    fs.writeFile(
        'mostSearched.json',
        JSON.stringify(mostSearchedList),
        function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
        }
    );

    browser.close();
}

module.exports = { scrapeIframePuppeteer, scrapeIframeCheerio, scrapeIframe };