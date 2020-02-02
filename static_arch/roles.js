// master is created with these defaults
const masterDefaults = {
  username: process.env.SUPER_USERNAME,
  password: process.env.SUPER_PASSWORD
};

// who can register for whome
const regArch = {
  // superadmin can register for admin
  superadmin: ['admin'],
  // admin can register for supervisor and user
  admin: ['supervisor', 'user'],
  // supervisor can register for user
  supervisor: ['user']
};

const roles = {
  // A master will be created when the app starts
  // using default master credentials
  master: 'superadmin',

  // basic user is used as a fallback for un assigned roles
  basic: 'user',

  // other roles
  others: ['admin', 'supervisor']
};

// return all roles
function rolesList (roles) {
  const rolesList = roles.others;
  rolesList.push(roles.master, roles.basic);
  return rolesList;
}

module.exports = {
  list: rolesList(roles),
  raw: roles,
  defaults: masterDefaults,
  regArch
};