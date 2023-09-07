const nunjucks = require('nunjucks');
const fs = require('fs');
const hello = fs.readFileSync('./templates/hello.html').toString();
const sendMailFromServer = require('../gmail');


const sendMail = async (req, res) => {
    const to = req.body.to;

    const html = nunjucks.renderString(hello, {
        name: 'John Doe',
    });

    const options = {
        from: `Test Team <${process.env.EMAIL}>`,
        to: to,
        replyTo: process.env.EMAIL,
        subject: 'Hello Test',
        text: 'This is a test email',
        html: html,
        textEncoding: 'base64',
        headers: [
            { key: 'X-Application-Developer', value: 'Been Helpful' },
            { key: 'X-Application-Version', value: 'v1.0.0' },
        ],
    };

    try {
        const messageId = await sendMailFromServer(options);

        res.status(200).json({
            message: 'Email sent',
            messageId: messageId,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error sending email',
            error: error,
        });
    }
};

module.exports = sendMail;