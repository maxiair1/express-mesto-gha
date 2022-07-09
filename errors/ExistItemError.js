const { ERROR_EXIST } = require('./errorCode');

class ExistItemError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExistItemError';
    this.statusCode = ERROR_EXIST;
  }
}

module.exports = ExistItemError;
