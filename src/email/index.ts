/* eslint-disable @typescript-eslint/no-var-requires */
import * as nodemailer from 'nodemailer';
import { URL, NODEMAILER } from '../environments';
import { Logger } from '@nestjs/common';
import { ExceptionData } from 'src/notifications/dtos/exception/exception-data';
import { ExceptionResultData } from 'src/notifications/dtos/exception-result/create.dto';
import { ArrivalData } from 'src/notifications/dtos/arrival/arrival-data';
import { ArrivalEmailData } from 'src/notifications/dtos/arrival/arrival-email.data';
import { Result } from 'src/notifications/enum/Result.enum';
const { readFile } = require('fs').promises;
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
}: ExceptionResultData) {
  return `
    Han visto el pedido de excepcion ${exceptionId} - Resultado: ${
    result == Result.ACCEPTED ? 'APROBADO' : 'RECHAZADO'
  } - Comentarios: ${comment}.
  `;
}

function getArrivalResultBody({
  driver,
  vehicle,
  contractor,
  result
}: ArrivalEmailData): string {
  return ` 
    El anuncio del conductor: ${driver} en el vehiculo: ${vehicle} por el contratista: ${contractor}
    ha sido ${result == Result.ACCEPTED ? 'APROBADO' : 'RECHAZADO'}
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
      subject: 'ANUNCIO DE ARRIBO',
      text: getArrivalEmailBody(arrivalData),
      html: `<p>${getArrivalEmailBody(arrivalData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}

export async function sendArrivalResultEmail(
  recipients: string[],
  arrivalData: ArrivalEmailData
) {
  logger.debug({ recipients, arrivalData });
  try {
    const info = await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: 'RESOLUCION DE ARRIBO DE CONDUCTOR',
      text: getArrivalResultBody(arrivalData),
      html: `<p>${getArrivalResultBody(arrivalData)}</p>`
    });
    logger.debug('Email sent.', info);
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}

export async function sendGenericEmail(
  template: string,
  subject: string,
  recipients: string[]
) {
  try {
    return await transporter.sendMail({
      from: NODEMAILER.email_address,
      to: recipients,
      subject: subject,
      text: '',
      html: template
    });
  } catch (error) {
    logger.error('There was an error sending the email notification', error);
  }
}

export async function findAndReeplaceTemplate(
  template: string,
  payload: object
) {
  logger.debug(`Finding template ${template}`);

  let html_template = await readFile(
    `src/email/templates/${template}.html`,
    'utf8'
  );

  html_template = html_template.replace('{{url}}', URL);

  const keys = Object.keys(payload);

  keys.forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html_template = html_template.replace(regex, payload[key]);
  });

  return html_template;
}
