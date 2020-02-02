const { CronJob } = require('cron');
const session = require('./jobs/sessions.js');
const superadmin = require('./jobs/superadmin.js');

module.exports = function () {
  session(CronJob);
  superadmin(CronJob);
};