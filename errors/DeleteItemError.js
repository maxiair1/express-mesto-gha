const { ERROR_DELETE } = require('./errorCode');

class DeleteItemError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeleteItemError';
    this.statusCode = ERROR_DELETE;
  }
}

module.exports = DeleteItemError;
