const JWT = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECERT_JWT_TOKEN;

// to validate jwt_token :
const validateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }

  try {
    const user = JWT.verify(token, secret);
    req.userAuth = user;
    console.log("user authenticated successfully!");
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
};

// to create jwt_token
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

// function validateToken(token) {
//   const payload = JWT.verify(token, secret);
//   return payload;
// }

module.exports = {
  createTokenForUser,
  validateToken,
};
