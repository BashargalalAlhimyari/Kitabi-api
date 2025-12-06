// =============================
// Imports
// =============================
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const User = require('../models/user');
const generateJWT = require('../utils/generateJWT');

// =============================
// Main Error Handler
// =============================
async function errorHandler(err, req, res, next) {

    // Only handle express-jwt errors
    if (err.name !== 'UnauthorizedError') {
        return next(err);
    }

    // If error is NOT about token expiration → return immediately
    if (!err.message.includes('jwt expired')) {
        return res.status(err.status || 401).json({
            message: err.message,
            type: err.name
        });
    }

    try {
        // =============================
        // 1) Extract Access Token
        // =============================
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return unauthorized("No token provided");
        }

        const accessToken = extractToken(authHeader);
        if (!accessToken) {
            return unauthorized("Invalid authorization header format");
        }

        // =============================
        // 2) Find Token in DB
        // =============================
        const storedToken = await Token.findOne({
            accessToken,
            refreshToken: { $exists: true }
        });

        if (!storedToken) {
            return unauthorized("Token not found or refresh token missing");
        }

        // =============================
        // 3) Verify Refresh Token
        // =============================
        const decoded = verifyRefreshToken(storedToken.refreshToken);

        // =============================
        // 4) Load User from DB
        // =============================
        const user = await User.findById(decoded.id);
        if (!user) {
            return unauthorized("User no longer exists");
        }

        // =============================
        // 5) Create New Access Token
        // =============================
        const payload = { id: user._id, isAdmin: user.isAdmin , user_email: user.user_email };
        const newAccessToken = await generateJWT(payload);

        // Update DB
        storedToken.accessToken = newAccessToken;
        await storedToken.save();

        // Add new token to response
        res.setHeader('Authorization', 'Bearer ' + newAccessToken);

        // Allow request to continue
        req.user = user;
        return next();

    } catch (refreshError) {
        return unauthorized(refreshError.message);
    }

    // =============================
    // Helper → Return Unauthorized
    // =============================
    function unauthorized(message) {
        return res.status(401).json({
            message,
            type: "Unauthorized"
        });
    }
}

// =============================
// Helper Functions
// =============================

// Extract Bearer token safely
function extractToken(header) {
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    return parts[1].trim();
}

// Verify Refresh Token
function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_JWT_SECRET);
}

module.exports = errorHandler;










// const generateJWT = require('../utils/generateJWT');
// const Token = require('../models/token');
// const User = require('../models/user');
// const jwt = require('jsonwebtoken');

// /*

// ما وظيفة الدالة؟

// الدالة errorHandler هي Middleware مهمتها:

// ✔ اعتراض أخطاء الـ JWT
// ✔ معرفة إذا كان التوكن منتهي (expired)
// ✔ إذا منتهي → تصدر Access Token جديد باستخدام Refresh Token
// ✔ وإذا أي شيء غلط → ترجع خطأ مناسب
// */
// async function errorHandler(err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         if (!err.message.includes('jwt expired')) {
//             return res.status(err.status).json({ message: err.message, type: err.name });
//         }
//         try {
//             const header = req.headers['authorization'];
//             if (!header) {
//                 return res.status(401).json({ message: "No token provided", type: "Unauthorized" });
//             }
//             const authtoken = header.split(" ")[1].trim();

//             const token = await Token.findOne({ accessToken: authtoken, refreshToken: { $exists: true } });
//             if (!token) {
//                 return res.status(401).json({ message: "token does not exist", type: "Unauthorized" });
//             }

//             const userData = jwt.verify(token.refreshToken, process.env.REFRESH_JWT_SECRET);

//             const user = await User.findById(userData.id);
//             if (!user) {
//                 return res.status(401).json({ message: "User not found", type: "Unauthorized" });
//             }
//             const payload = { id: user._id, isAdmin: user.isAdmin };
//             const newAccessToken = await generateJWT(payload);
//             req.headers['authorization'] = 'Bearer ' + newAccessToken;

//             token.accessToken = newAccessToken;
//             await token.save();

//             res.set('Authorization', 'Bearer ' + newAccessToken);

//            return next();
//         } catch (refreshError) {
//             return res.status(401).json({ message: refreshError.message, type: "Unauthorized" });
//         }

//     }
// }

// module.exports = errorHandler;





