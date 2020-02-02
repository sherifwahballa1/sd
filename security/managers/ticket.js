const jwt = require('jsonwebtoken');

const config = require('../../config');

// check if ticket exists
function isExists (req) {
  if (req.headers.authorization && req.headers.authorization !== undefined) {
    return true;
  } return false;
}

// sign ticket
function signTicket (data) {
  return jwt.sign(data, config.JWTsecret);
}

// return decodedString/false
function verifyTicket (req) {
  return jwt.verify(req.headers.authorization, config.JWTsecret);
}

module.exports = {
  isExists,
  sign: signTicket,
  verify: verifyTicket
};