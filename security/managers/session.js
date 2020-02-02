const Config = require('../../config');
const Session = require('../session.model');
const Logger = require('../../modules/logger.js');
const timeFactory = require('../../modules/time-factory.js');


// timeFactory.cal('add', opts.ticketValidationInDays, 'day', new Date()),
// timeFactory.cal('add', config.overRequestBanDurationInHours, 'hours', new Date());\
function generateLoginDetails () {
  return {
    exp: timeFactory.to('seconds', timeFactory.cal('add', Config.ticketValidationInDays, 'day', new Date())),
    iat: timeFactory.to('seconds', new Date()),
    maxLogins: Config.maxLogins
  };
}
// generated next release time
function generateBlockDetails () {
  return {
    nextAt: timeFactory.cal('add', Config.banDurationInHours, 'day', new Date())
  };
}
// check if login expired
function isLoginExpired (s) {
  const now = timeFactory.to('seconds', new Date());
  return (s.exp < now);
}

module.exports = {

  // accepts user id and pass newly created session to the callback
  login (user, cb) {
    let newLogin;
    Session.findOne({ user: user._id }).exec(function (err, record) {
      if (!record) {
        record = new Session();
        record.createFor(user);
      }
      newLogin = record.newLogin(generateLoginDetails());
      record.save(function (err, record) {
        cb(newLogin);
      });

    });
  },
  // works on the level of validation
  validateURN (req, cb) {
    Session.findOne({ user: req.userData._id }).exec(function (err, record) {
      if (record) {

        // user session usage is not blocked
        if (record.usage.blocked && record.usage.nextAt > new Date()) {
          return cb({ error: 'user is blocked for session abuse and not ready for next usage', valid: false, record });
        }

        // session number exists
        const currentSession = record.getLogin(req.userData.urn);
        if (!currentSession) return cb({ error: 'login session number not found', valid: false, record });

        // session date is not expired
        if (isLoginExpired(currentSession)) return cb({ error: 'login session expired', valid: false, record });

        return cb({ error: null, valid: true, record });

      } else {
        return cb({ error: 'session record not found', valid: false, record });
      }

    });
  },
  // works on the level of usage and triggers the block
  // returns true false;
  hasVisits (record) {
    // not with in an hour - so everything resets
    if (timeFactory.difIn('hours', record.usage.span, new Date().toISOString()) > 1) {

      record.resetUsage();
      record.recordUsage();
      record.save();
      return true;

    } else {
      // exceeded limit rate per hour
      Logger.trace('highlight', 'is out of the span', `total visits ${record.usage.total}`);
      if (record.usage.total >= Config.maxTicketUsagePerHour) {
        record.blockUsage(generateBlockDetails());
        record.save();
        return false;
      } else {
        // record another visit
        record.recordUsage();
        record.save();
        return true;
      }
    }

  }

};