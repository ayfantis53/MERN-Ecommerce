import nodemailer from 'nodemailer';

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PWD
        }
    });

    const message = {
        from: `${ process.env.SMTP_FROM_NAME } < ${ process.env.SMTP_FROM_EMAIL }>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

export default sendEmail;