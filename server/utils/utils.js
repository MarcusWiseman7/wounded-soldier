const nodemailer = require('nodemailer');

// Nodemailer transport
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.office365.com',
    auth: { user: 'no-reply.beerjournal@outlook.com', pass: process.env.EMAIL_PASS },
});

module.exports = { smtpTransport };
