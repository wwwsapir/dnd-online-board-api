const nodemailer = require("nodemailer");
require("dotenv/config");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const sendResetPasswordEmail = async (toEmail, resetPasswordToken, res) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

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

    const mailOptions = {
      from: "D&D Online Board < " + process.env.EMAIL_USERNAME + ">",
      to: toEmail,
      subject: "Reset Password for D&D Online Board",
      generateTextFromHTML: true,
      html:
        "<p>Please click this link to complete the password reset process: " +
        process.env.FRONT_END_RESET_URL +
        ":" +
        resetPasswordToken +
        "<br></br><br></br> If you didn't request this email, please ignore it.</p>",
    };

    smtpTransport.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(400).json({ error: { message: err.message } });
      } else {
        res.status(200).json("Sent successfully!");
        smtpTransport.close();
      }
    });
  } catch (generalError) {
    return res.status(400).json({ error: { message: generalError.message } });
  }
};

module.exports.sendResetPasswordEmail = sendResetPasswordEmail;
