const express = require('express');
const server = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

server.use(express.urlencoded({ extended: true })); 
server.use(express.json({extended: true}));

server.use(express.static(path.join(__dirname, 'public')));

server.listen( PORT, () => {
    console.info(`Server is running on *:${ PORT }`);
});