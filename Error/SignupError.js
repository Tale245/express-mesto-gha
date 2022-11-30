const { SIGNUP_ERROR } = require('../constants/constants');

class SignupError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SIGNUP_ERROR;
  }
}

module.exports = SignupError;
