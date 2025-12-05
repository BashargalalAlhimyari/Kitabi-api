const nodemailer = require('nodemailer');
const htmlBody = (otp) => `
<div style="background:#f4f4f7; padding:30px; font-family:Arial, sans-serif;">
  <div style="max-width:500px; background:white; margin:auto; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:24px;">Password Reset</h1>
    </div>

    <!-- Body -->
    <div style="padding:25px;">
      <p style="font-size:16px; color:#333;">
        Hello,
        <br><br>
        Please use the verification code below to reset your password.
      </p>

      <!-- OTP Box -->
      <div style="
        font-size:36px;
        font-weight:bold;
        text-align:center;
        padding:20px;
        margin:25px 0;
        background:#f9fafb;
        border:2px dashed #4f46e5;
        color:#4f46e5;
        border-radius:10px;
        letter-spacing:8px;
      ">
        ${otp}
      </div>

      <p style="font-size:14px; color:#555; line-height:1.6;">
        This code is valid for <strong>10 minutes</strong>.  
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <div style="margin-top:30px; text-align:center;">
        <a href="#" style="
          background:#4f46e5;
          color:white;
          padding:12px 22px;
          text-decoration:none;
          border-radius:8px;
          font-size:14px;
          display:inline-block;
        ">
          Visit Website
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#777;">
      © ${new Date().getFullYear()} Ecommerce App — All Rights Reserved
    </div>

  </div>
</div>
`;


exports.sendEmail = async (email, subject, otp) => {
    try {
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
            html: htmlBody(otp)
        };

        // sendMail returns a promise when no callback is passed
        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            info: info.response
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};
