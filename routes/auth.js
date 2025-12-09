const express = require("express")

const router = express.Router()

const { body } = require("express-validator")

const authcontroller = require("../controllers/auth")

const validateDataUser = [
    body("user_name")
        .not()
        .isEmpty()
        .withMessage('name is required'),
    body("user_email")
        .not()
        .isEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be correct'),
    body("user_password")
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
        .isStrongPassword()
        .withMessage('password must be contain at least one lowercase letter, one uppercase letter, one number and one special character'),
    body('phone')
        .isMobilePhone()
        .withMessage('please enter a valid phone number')
]

const validateResetPassword = [
     body("new_password")
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
        .isStrongPassword()
        .withMessage('password must be contain at least one lowercase letter, one uppercase letter, one number and one special character'),

]
router.post("/register",validateDataUser, authcontroller.register)
router.post("/login", authcontroller.login)
router.post("/forget-password", authcontroller.forgetPassword)
router.post("/verifyotp", authcontroller.verifyPasswordResetOtp)
router.post("/verifyToken", authcontroller.verifyToken)
router.post("/reset-password",validateResetPassword , authcontroller.resetPassword)
router.get("/users", authcontroller.getAllUsers)

module.exports = router
