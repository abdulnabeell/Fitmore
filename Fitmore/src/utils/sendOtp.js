const nodemailer = require('nodemailer');

const sendOtp = async (email, otp) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Fitmore OTP Verification',
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `
    });

    console.log('OTP email sent to:', email);

  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = sendOtp;
