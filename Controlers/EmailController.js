require('dotenv').config();

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const client_id = process.env.GMAIL_CLIENT_ID;
const client_secret = process.env.GMAIL_SECRET_ID;
const redirect_uri = process.env.GMAIL_REDIRECT_URI;
const refresh_token = process.env.GMAIL_REFRESH_TOKEN;

exports.sendEmail = async(req, res, mailMessage) => {
    try {
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        oAuth2Client.setCredentials({ refresh_token });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'sweetiehimanshu@gmail.com',
                clientId: client_id,
                clientSecret: client_secret,
                refreshToken: refresh_token,
                accessToken
            }
        });

        const mailOptions = {
            from: "Himanshu sharma <sweetiehimanshu@gmail.com>",
            to: 'acc4pne@gmail.com',
            subject: 'Low stock on medicine',
            text: mailMessage,
            html: `<h1>${mailMessage}</h1>`
        }

        const result = await transport.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
}