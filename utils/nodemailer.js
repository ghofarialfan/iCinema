import nodemailer from "nodemailer";
import logger from "./logger.js";

export const sendEmail = (email, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
    html: "<b>Hello Dear User, we are happy that you join our family. Kind Regards, iCinema Team.</b>",
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      logger.error({ err }, "Failed to send email");
    } else {
      logger.info("Email sent successfully");
    }
  });
};
