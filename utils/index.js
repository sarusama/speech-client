const os = require('os');

const getLocalIPv4 = () => {
  const networks = os.networkInterfaces();
  let ipv4 = '';

  for (let network in networks) {
    for (let item of networks[network]) {
      if (item.family === 'IPv4' && !item.internal) {
        ipv4 = item.address;
        break;
      }
    }
    if (ipv4) {
      break;
    }
  }

  return ipv4 || '127.0.0.1';
};

module.exports = {
  getLocalIPv4,
};
