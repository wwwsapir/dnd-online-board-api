const nodemailer = require("nodemailer");
require("dotenv/config");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const sendResetPasswordEmail = async (toEmail, resetPasswordToken) => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });
  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USERNAME,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  try {
    const mailOptions = {
      from: "D&D Online Board < " + process.env.EMAIL_USERNAME + ">",
      to: toEmail,
      subject: "Reset Password for D&D Online Board",
      generateTextFromHTML: true,
      html:
        "<p>Please click this link to complete the password reset process: " +
        process.env.HOME_URL +
        "/reset_password/reset/:" +
        resetPasswordToken +
        "<br></br> If you didn't ask for this email, please ignore it.</p>",
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendResetPasswordEmail = sendResetPasswordEmail;
