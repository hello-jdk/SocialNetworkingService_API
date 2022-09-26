const jwt = require("../modules/jwt");
const { BadRequestError, UnauthorizedError } = require("../modules/error");
const { TOKEN_EXPIRED, TOKEN_INVALID } = require("../config/index").JWT;

const authUtil = {
  checkToken: async (req, res, next) => {
    var token = req.headers.token;
    // 토큰 없음
    if (!token) {
      throw new BadRequestError("토큰이 비어있습니다.");
    }
    // 디코드
    const user = await jwt.verify(token);
    // 토큰 만료
    if (user === TOKEN_EXPIRED) {
      throw new UnauthorizedError("토큰이 만료되었습니다.");
    }
    // 토큰 유효하지 않음
    if (user === TOKEN_INVALID) {
      throw new UnauthorizedError("토큰이 유효하지않습니다.");
    }
    // DB 정보와 다름
    if (user.id === undefined) {
      throw new UnauthorizedError("유저 정보가 일치하지 않습니다.");
    }
    req.body.userEmail = user.email;
    next();
  },
};

module.exports = authUtil;
