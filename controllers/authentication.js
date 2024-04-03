const JWT = require("jsonwebtoken");

const secret = process.env.SECERT_JWT_TOKEN;

function createTokenForUser(user) {
  //   console.log("token: ", user);
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = JWT.sign(payload, secret, {
    expiresIn: "6h",
  });
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
