const { NOT__FOUND_ERROR } = require('../constants/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT__FOUND_ERROR;
  }
}

module.exports = NotFoundError;
