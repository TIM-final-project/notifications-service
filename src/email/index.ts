import * as nodemailer from 'nodemailer';
import { NODEMAILER } from 'src/environments';
import { Logger } from '@nestjs/common';
import { ExceptionData } from 'src/notifications/dtos/exception/exception-data';
import { ExceptionResultCreateDTO } from 'src/notifications/dtos/exception-result/create.dto';
import { ArrivalData } from 'src/notifications/dtos/arrival/arrival-data';
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

function getArrivalEmailBody({ driver, vehicle, contractor }: ArrivalData) {
  return `
    Se ha anunciado el Conductor: ${driver} - Vehiculo: ${vehicle} - Contratista: ${contractor}
    Por favor ingrese a la aplicacion para resolver la situacion.
  `;
}

function getExeptionResultEmailBody({
  exceptionId,
  comment,
  result
}: ExceptionResultCreateDTO) {
  return `
    Han visto el pedido de excepcion ${exceptionId} - Resultado: ${
    result ? 'APROBADO' : 'RECHAZADO'
  } - Comentarios: ${comment}.
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

export async function sendArrivalEmail(
  recipients: string[],
  arrivalData: ArrivalData
) {
  logger.debug({ recipients, arrivalData });
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'PEDIDO DE EXCEPCION',
      text: getArrivalEmailBody(arrivalData),
      html: `<p>${getArrivalEmailBody(arrivalData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}

export async function sendExceptionResultEmail(
  recipients: string[],
  exceptionData: ExceptionResultCreateDTO
) {
  logger.debug({ recipients, exceptionData });
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'RESOLUCION DE EXCEPCION',
      text: getExeptionResultEmailBody(exceptionData),
      html: `<p>${getExeptionResultEmailBody(exceptionData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}
