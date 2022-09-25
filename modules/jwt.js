const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/index").JWT;
const { TOKEN_EXPIRED, TOKEN_INVALID } = require("../config/index").JWT;

module.exports = {
  //JWT 생성
  login: async (user) => {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const result = {
      token: jwt.sign(payload, jwtConfig.secretKey, jwtConfig.option),
      refreshToken: randToken.uid(256),
    };
    return result;
  },

  //JWT 검증
  verify: async (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (err.message === "jwt expired") {
        console.log("[JWT] : expired token");
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        console.log("[JWT] : invalid token");
        console.log(TOKEN_INVALID);
        return TOKEN_INVALID;
      } else {
        console.log("[JWT] : invalid token");
        return TOKEN_INVALID;
      }
    }
    return decoded;
  },
};
