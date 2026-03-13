const { signup } = require('./signup');
const { verifyOtp } = require('./verifyOtp');
const { resendOtp } = require('./resendOtp');
const { forgotPassword } = require('./forgotPassword');
const { resetPassword } = require('./resetPassword');
const { verifyForgotOtp } = require('./verifyForgotOtp');
const { login } = require('./login');

module.exports = {
    signup,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    verifyForgotOtp,
    login
};
