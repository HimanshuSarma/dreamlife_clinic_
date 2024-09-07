const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
});

const sendMailHandler = async ({
    recipients,
    subject,
    body
}) => {
    const mailOptions = {
        from: process.env.GMAIL_ID,
        to: recipients,
        subject,
        text: body,
    };

    const sendMailRes = await transporter.sendMail(mailOptions);
    return sendMailRes;
}

module.exports = {
    sendMailHandler
}