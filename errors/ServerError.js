const { ERROR_SERVER } = require('./errorCode');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = ERROR_SERVER;
  }
}

module.exports = ServerError;
