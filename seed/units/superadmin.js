const User = require('../../components/user/user.model');
const Roles = require('../../static_arch/roles');
const Logger = require('../../modules/logger.js');


module.exports = function () {


  // on app restart it adds admin if not added
  User.findOne({ role: Roles.raw.master }).exec(function (err, user) {
    // if no superadmin found in db
    if (!user) {

      // check if superadmin data is set
      if (!process.env.SUPER_USERNAME || !process.env.SUPER_PASSWORD) {
        Logger.trace('danger', 'seeds/superadmin', 'superadmin not set', true);
        return false;
      }
      const user = new User;
      user.addSuper({ username: process.env.SUPER_USERNAME, password: process.env.SUPER_PASSWORD });
      user.save(function (err, u) {
        if (!err) {
          Logger.trace('highlight', 'seeds/superadmin', 'superadmin added...', true);
        }
      });
    } else {
      Logger.trace('highlight', 'seeds/superadmin', 'superadmin already initialized', true);
    }
  });
};