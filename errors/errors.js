const ERROR_REQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_SERVER = 500;

class FindByIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FindByIdError';
    this.statusCode = 400;
  }
}

module.exports = {
  ERROR_REQUEST,
  ERROR_NOTFOUND,
  ERROR_SERVER,
  FindByIdError,
};
