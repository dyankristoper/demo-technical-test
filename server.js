const express = require('express');
const server = express();

const PORT = 3000;
const si = require('systeminformation');

const getSystemInfo = async () => {
    // System information
    // define all values, you want to get back
    valueObject = {
      cpu: '*',
      osInfo: '*',
      system: '*',
      connection: '*',
      audio: '*',
      memory: '*'
    };
  
    //   si.get(valueObject).then((data) => console.log(data));
    const getSystemInfo = await si
      .get(valueObject)
      .catch((error) => console.error(error));

    return getSystemInfo;
}

server.get('/', async (request, response) => {
    const systemInfo = await getSystemInfo();

    response
        .status( 200 )
        .send( systemInfo );

});

server.listen( PORT, () => {
    console.info(`Server is running on *:${ PORT }`);
});