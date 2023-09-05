const nunjucks = require('nunjucks');
const useMailer = require('../plugins/useMailer');
const fs = require('fs');
const hello = fs.readFileSync('./templates/hello.html').toString();
// const path = require('path');
// const hello = path.resolve('../templates/hello.html?raw');

const mailer = useMailer();

const sendMail = async (req, res) => {
    const to = req.body.to;

    const html = nunjucks.renderString(hello, {
        name: 'John Doe',
    });

    try {
        const info = await mailer.sendMail({
            from: `Test Team <${process.env.EMAIL}>`,
            to: to,
            subject: 'Welcome to Test',
            html: html,
        });

        res.status(200).json({
            message: 'Email sent',
            info: info,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error sending email',
            error: error,
        });
    }
};

module.exports = sendMail;