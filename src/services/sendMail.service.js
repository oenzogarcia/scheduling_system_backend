const dotenv = require('dotenv');

dotenv.config();

const nodemailer = require('nodemailer');


const sendMailService = (email,subject, text, path) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Por exemplo, 'gmail'
      auth: {
      user: 'gustavobatistadev@gmail.com',
      pass: process.env.PASSWORD_APP_SMTP
    }
  });

  const mailOptions = {
      from: 'gustavobatistadev@gmail.com',
      to: email,
      subject: subject,
      text: text + path
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return {
        message: 'success'
      };
    }
    return {
          message: 'error'
        };
    });
};

module.exports = {
  sendMailService
};