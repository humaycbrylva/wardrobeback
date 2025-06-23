import nodemailer from 'nodemailer';

export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Təsdiqləmə Kodu',
    text: `Qeydiyyatınızı tamamlamaq üçün OTP kodunuz: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
