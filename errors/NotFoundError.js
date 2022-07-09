const { ERROR_NOT_FOUND } = require('./errorCode');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = ERROR_NOT_FOUND;
  }
}

module.exports = NotFoundError;
