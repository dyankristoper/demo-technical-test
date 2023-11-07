const puppeteer = require('puppeteer');
const cheerio   = require("cheerio");
const axios     = require("axios");

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

module.exports = { scrapeIframePuppeteer, scrapeIframeCheerio };