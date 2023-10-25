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
    
    const getSystemInfo = await si
        .get(valueObject)
        .catch((error) => console.error(error));

    return getSystemInfo;
}

module.exports = getSystemInfo;