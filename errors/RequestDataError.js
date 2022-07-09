const { ERROR_NOT_CORRECT } = require('./errorCode');

class RequestDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RequestDataError';
    this.statusCode = ERROR_NOT_CORRECT;
  }
}

module.exports = RequestDataError;
