const { StatusCodes } = require("http-status-codes");

//기본 에러 클래스
class BasicError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isCustom = true;
  }
}

//400 잘못된요청
class BadRequestError extends BasicError {
  constructor(message) {
    super("BadRequestError", message, StatusCodes.BAD_REQUEST);
  }
}

//401 인증자격요구
class UnauthorizedError extends BasicError {
  constructor(message) {
    super("Unautorized", message, StatusCodes.UNAUTHORIZED);
  }
}

//403 권한거절
class ForbiddenError extends BasicError {
  constructor(message) {
    super("Forbidden", message, StatusCodes.FORBIDDEN);
  }
}

//404
class NotFoundError extends BasicError {
  constructor(message) {
    super("NotFoundError", message, StatusCodes.NOT_FOUND);
  }
}

//409 리소스충돌
class ConflictError extends BasicError {
  constructor(message) {
    super("ConfilctError", message, StatusCodes.CONFLICT);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
