import * as nodemailer from 'nodemailer';
import { NODEMAILER } from 'src/environments';
import { Logger } from '@nestjs/common';
import { ExceptionData } from 'src/notifications/dtos/exception/exception-data';
// Generate test SMTP service account from ethereal.email

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  ...NODEMAILER.transport
});

console.log(NODEMAILER);

const logger = new Logger('Email Notifications');

function getExeptionEmailBody({ driver, vehicle, contractor }: ExceptionData) {
  return `
    Se ha solicitado una Excepcion para el ingreso de Conductor: ${driver} - Vehiculo: ${vehicle} - Contratista: ${contractor}
    Por favor ingrese a la aplicacion para resolver la situacion.
  `;
}

function getExeptionResultEmailBody({ driver, vehicle, contractor }: ExceptionData) {
  return `
    Han visto el pedido de excepcion solicitado para el Conductor: ${driver} - Vehiculo: ${vehicle} - Contratista: ${contractor}
    Por favor ingrese a la aplicacion para finalizar con el proceso.
  `;
}

export async function sendExceptionEmail(
  recipients: string[],
  exceptionData: ExceptionData
) {
  logger.debug({ recipients, exceptionData });
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'PEDIDO DE EXCEPCION',
      text: getExeptionEmailBody(exceptionData),
      html: `<p>${getExeptionEmailBody(exceptionData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}

export async function sendExceptionResultEmail(
  recipients: string[],
  exceptionData: ExceptionData
) {
  logger.debug({ recipients, exceptionData });
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'RESOLUCION EXCEPCION',
      text: getExeptionResultEmailBody(exceptionData),
      html: `<p>${getExeptionResultEmailBody(exceptionData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}
