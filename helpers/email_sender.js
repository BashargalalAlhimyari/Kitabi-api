const nodemailer = require('nodemailer');

exports.sendEmail = async (email, subject, body, successMessage, errorMessage) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: body
    };
    try {
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                // return res.status(500).send({ status: "FAIL", message: error })
                if (errorMessage) {
                    return res.status(500).send({ status: "FAIL", message: errorMessage })
                }else{

                }
            }
            if(successMessage){
                console.log('Email sent: ' + info.response);
                return res.status(200).send({ status: "SUCCESS", message: "password reset OTP sent to your email" })
            }
        });
        console.log(successMessage);
    } catch (error) {
        console.error(errorMessage, error);
    }
}