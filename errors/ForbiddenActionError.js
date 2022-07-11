const { ERROR_FORBIDDEN } = require('./errorCode');

class ForbiddenActionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenActionError';
    this.statusCode = ERROR_FORBIDDEN;
  }
}

module.exports = ForbiddenActionError;
