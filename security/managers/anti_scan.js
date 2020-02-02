
const redis = require('redis');
const geoip = require('geoip-lite');

const Logger = require('../../modules/logger');
const Config = require('../../config');
const requestIp = require('request-ip');
// const Say = require('../../langs');


const client = redis.createClient();

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  Logger.trace('danger', 'anit-scan REDIS', err, true);
});

const dayInSec = 86400;
const prefix = 'monit404:';
const prefixBlocked = 'blocked:';

const checkMax = 4;
const scanMax = 7;

module.exports = {
  log404 (req) {
    // get client ip
    const ip = requestIp.getClientIp(req);
    // reference to monit and block
    const ipToMonit = prefix + ip; // monit404:192.100.0.0
    const ipToBlock = prefixBlocked + ip; // block:192.200.0.1

    // request monit
    client.hgetall(ipToMonit, function (err, object) {
      if (err) console.log(err);

      if (object) {
        console.log(object);

        let geo = geoip.lookup(ip);
        if (geo) {
          geo.range = geo.range.toString();
          geo.ll = geo.ll.toString();

          // have not been searched before
          if (!object.country && object.count >= checkMax) {
            // background check ip information
            console.log('looking for ip information...');

            // this prevents another check on the same ip
            object.country = geo.country;
            console.log('check running ..');
            console.log(geo);
            if (geo.country !== 'EG') {
              // vpn blocked
              console.log(`${ip} blocked for using vpn`);
              client.hmset(ipToBlock, geo);
              client.expireat(ipToBlock, parseInt((+new Date) / 1000) + dayInSec * Config.foreignIpBlockInDays);
            }

          } else if (object.country && object.count >= scanMax) {
            console.log(`${ip} blocked for scanning`);
            client.hmset(ipToBlock, geo);
            client.expireat(ipToBlock, parseInt((+new Date) / 1000) + dayInSec * Config.scanBlockInDays);
          }
        } else {
          if (object.count >= scanMax) {
            geo = {}; geo.country = 'using local ip';
            client.hmset(ipToBlock, geo);
            client.expireat(ipToBlock, parseInt((+new Date) / 1000) + dayInSec * Config.scanBlockInDays);
          }
        }
        // saving visit
        object.count++;
        client.hmset(ipToMonit, object);

      } else {
        client.hmset(ipToMonit, { count: 1 });
        client.expireat(ipToMonit, parseInt((+new Date) / 1000) + dayInSec);
      }
    });
  },
  preventBlocked (req, res, next) {
    const ipToBlock = prefixBlocked + requestIp.getClientIp(req);
    client.hgetall(ipToBlock, function (err, object) {
      if (object) {
        if (object.country !== 'EG') {
          console.log(`${ipToBlock} from country ${object.country}`);
          return res.status(429).json({ error: 'Say.error.vpnBlocked ' });
        } else {
          console.log(`${ipToBlock} from Egypt for Scanning`);
          return res.status(429).json({ error: 'Say.error.ipBlocked' });
        }

      } else {
        next();
      }
    });
  }
};



// if(object.count > max){
//     let geo = geoip.lookup(ip);
//     if(geo){
//         console.log(geo);
//         client.hmset(ipToBlock,geo);
//         if(geo.country == "EG"){
//             client.expireat(ipToBlock, parseInt((+new Date)/1000) + dayInSec*10);
//         } else {
//             client.expireat(ipToBlock, parseInt((+new Date)/1000) + dayInSec*365);
//         }
//         object.count++;
//         client.hmset(ipToMonit, object);
//     }
// } else {
//     object.count++;
//     client.hmset(ipToMonit, object);
// }