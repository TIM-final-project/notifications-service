import * as nodemailer from 'nodemailer';
import { NODEMAILER } from 'src/environments';
import { Logger } from '@nestjs/common';
// Generate test SMTP service account from ethereal.email

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  ...NODEMAILER.transport
});

console.log(NODEMAILER);

const logger = new Logger('Email Notifications');

export async function sendExceptionEmail(recipients: string[]) {
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'Hello ✔',
      text: 'Hello world?',
      html: '<b>Hello world?</b>'
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}
