const express = require('express');
const server = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

const scrapeIframe = require('./utils/scrapeIframe');

server.use(express.urlencoded({ extended: true })); 
server.use(express.json({extended: true}));

server.use(express.static(path.join(__dirname, 'public')));

server.get('/scrape', async (request, response) => {
    const logs = await scrapeIframe();

    response
        .status(200)
        .send({ data: logs });
})

server.listen( PORT, () => {
    console.info(`Server is running on *:${ PORT }`);
});