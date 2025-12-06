const e_jwt = require('express-jwt');
const { Token } = require('../models/token');

function authjwt() {
    const api = process.env.API_URL;
    return e_jwt.expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // استثناء المسارات التي لا تحتاج إلى توكن
            `${api}/auth/login`,
            `${api}/auth/login/`,

            `${api}/auth/register`
                `${api}/auth/register/`

                `${api}/auth/forgot-password`,
            `${api}/auth/forgot-password/`,

            `${api}/auth/verifyotp`,
            `${api}/auth/verifyotp/`,

            `${api}/auth/reset-password`,
            `${api}/auth/reset-password/`

        ]
    });
}


/* ---------------------- Helper Functions ---------------------- */

async function isRevoked(req, payload) {
    try {
        // 1. استخراج التوكن من الهيدر
        const token = extractToken(req);
        if (!token) return true;

        // 2. التحقق من وجود التوكن في قاعدة البيانات
        const storedToken = await Token.findOne({ accessToken: token });
        if (!storedToken) return true;

        // 3. التحقق من صلاحيات الأدمن للمسارات المحمية
        if (isAdminRoute(req) && !payload.isAdmin) {
            return true;
        }

        // 4. كل شيء تمام
        return false;

    } catch (error) {
        return true;
    }
}

// استخراج التوكن من الهيدر
function extractToken(req) {
    const header = req.headers.authorization;
    if (!header) return null;

    const parts = header.split(' ');
    return parts.length === 2 ? parts[1] : null;
}

// التحقق إذا كان المسار مسار أدمن
function isAdminRoute(req) {
    const adminRegex = /^\/api\/v1\/admin\//i;
    return adminRegex.test(req.originalUrl);
}

module.exports = authjwt;
