// const { validateToken } = require("../controllers/authentication");

// function checkForAuthenticationCookie(cookieName) {
//   return (req, res, next) => {
//     const tokenCookieValue = req.cookies[cookieName];
//     if (!tokenCookieValue) {
//       return next();
//     }

//     try {
//       const userPayload = validateToken(tokenCookieValue);
//       req.user = userPayload;
//     } catch (error) {
//       console.log(error);
//     }

//     return next();
//   };
// }

// module.exports = {
//   checkForAuthenticationCookie,
// };
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkForAuthenticationCookie = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
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
        const user =  jwt.verify(token, process.env.SECERT_JWT_TOKEN);
        req.userAuth=user   
        next();
    }catch (error) {
        return res.status(403).json({
        errors: [
            {
                msg: "Invalid token",
            },
        ],
        });
    }
};

module.exports = checkForAuthenticationCookie;
