const { ERROR_CREATE } = require('./errorCode');

class CreateItemError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CreateItemError';
    this.statusCode = ERROR_CREATE;
  }
}

module.exports = CreateItemError;
