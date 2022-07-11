const { ERROR_REQUEST } = require('./errorCode');

class RequestNotCorrectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RequestNotCorrectError';
    this.statusCode = ERROR_REQUEST;
  }
}

module.exports = RequestNotCorrectError;
