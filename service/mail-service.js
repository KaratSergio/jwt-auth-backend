import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const sendActivationMail = async (to, link) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Account activation on ${process.env.API_URL}`,
    text: '',
    html: `
      <div>
        <h1>To activate, follow the link</h1>
        <a href="${link}">${link}</a>
      </div>
    `,
  });
};

export { sendActivationMail };
