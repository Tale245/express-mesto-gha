const { BAD__REQUEST_ERROR } = require('../constants/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD__REQUEST_ERROR;
  }
}

module.exports = BadRequestError;
