require('dotenv').config();

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;

const { scrapeIframePuppeteer, scrapeIframeCheerio, scrapeIframe } = require('./utils/scrapeIframe');

server.use(express.urlencoded({ extended: true })); 
// server.use(express.json({extended: true}));
server.use(bodyParser.json());

server.use(express.static(path.join(__dirname, 'public')));

server.get('/diagnostics', ( request, response ) => {
    // rtcDiagnostics();

    response
        .status(200)
        .send({ status: "Ok" });
});

server.get('/scrape', async (request, response) => {
    console.log('Scraping.,,,');

    // const { webSocketUrl } = request.body;
    // const logs = await scrapeIframe( webSocketUrl );

    // const logs = await scrapeIframeCheerio();

    await scrapeIframe();

    response
        .status(200)
        .send({ status: "Ok" });
});

server.listen( PORT, () => {
    console.info(`Server is running on *:${ PORT }`);
});