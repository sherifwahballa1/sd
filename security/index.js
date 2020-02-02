const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');
const requestIp = require('request-ip');
const jwt = require('jsonwebtoken');

const sessionManager = require('./managers/session');
const roleManager = require('./managers/role');
const ticketManager = require('./managers/ticket');
const antiScanManager = require('./managers/anti_scan');
const Logger = require('../modules/logger');
// const Say = require('../langs');
const Config = require('../config');

const store = new RedisStore({
  host: '127.0.0.1',
  port: 6379
});

function failCallback (req, res, next, nextValidRequestDate) {
  return res.status(429).json({ error: 'Say.error.ipBlocked' });
}
function handleStoreError (error) {
  Logger.trace('vivid', 'security', error, true);
}

const strictUse = new ExpressBrute(store, {
  freeRetries: Config.freeRetriesOnStrictRoutes,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
  failCallback,
  handleStoreError
});

function preventAbuseFunction (fn, options) {
  if (Config.preventAbuse === true) {
    return fn;
  } else {
    if (options && options.next === false) {
      return function () {};
    }
    return function (req, res, next) {return next();};
  }
}

module.exports = {
  masking (app) {
    app.use(function (req, res, next) {
      res.setHeader('X-Powered-By', 'PHP/5.1.2');
      next();
    });
  },
  log404: preventAbuseFunction(antiScanManager.log404, { next: false }),
  preventBlocked: preventAbuseFunction(antiScanManager.preventBlocked),
  strictUse: preventAbuseFunction(strictUse.getMiddleware({
    key (req, res, next) {
      next(`${req.originalUrl}||${requestIp.getClientIp(req)}`);
    }
  })),
  buildTicket (user, cb) {
    sessionManager.login(user, function (t) {
      t = { ...t, _id: user._id, role: user.role };
      cb(ticketManager.sign(t));
    });
  },

  auth (allowedRoles) {
    return function (req, res, next) {
      try {
        req.userData = jwt.verify(req.headers.authorization, Config.JWTsecret);

        if (!roleManager.isRoleAllowed(req, allowedRoles)) throw new Error();

        sessionManager.validateURN(req, function (opts) {
          if (!opts.valid) return res.status(401).json({ message: 'Session Expired' });
          if (!sessionManager.hasVisits(opts.record)) return res.status(401).json({ message: 'Try again later' });
          next();
        });

      } catch (error) {
        return res.status(401).json({ message: 'Session Expired' });
      }
    };
  },

  validateTempToken (req, res, next) {

    try {
      const tokenDecodedData = jwt.verify(req.headers.authorization, Config.tempTokenSecret);
      req.userData = tokenDecodedData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Session Expired' });
    }
  }
};