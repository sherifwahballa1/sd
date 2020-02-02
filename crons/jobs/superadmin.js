const Roles = require('../../static_arch/roles');
const User = require('../../components/user/user.model');
const Logger = require('../../modules/logger.js');
const Config = require('../../config');

module.exports = function (CronJob) {

  // comment if needed [start -a1 ] if you don't want superadmin to be removed automatically
  const job = new CronJob({
    // runs every saturday at 3 am;
    cronTime: '00 00 03 * * 6',
    onTick () {
      Logger.trace('highlight', 'cronjob', 'remove all superadmins');
      User.find({ role: Roles.raw.master }).remove().exec();
    },
    start: false,
    timeZone: Config.timeZone
  });
  job.start();
  // comment if needed [start -a1 ]

};