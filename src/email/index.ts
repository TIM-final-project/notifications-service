import nodemailer from 'nodemailer';
import { NODEMAILER } from 'src/environments';
// Generate test SMTP service account from ethereal.email

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: NODEMAILER.host,
  port: NODEMAILER.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: NODEMAILER.account.user,
    pass: NODEMAILER.account.pass
  }
});

export async function sendExceptionEmail(recipients: string[]) {
  let info = await transporter.sendMail({
    from: NODEMAILER.email_address,
    to: recipients,
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
  });
}
