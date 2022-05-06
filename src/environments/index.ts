import * as dotenv from 'dotenv';

dotenv.config();

//server URL
const URL: string = process.env.URL;

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'dev';

//application
const PORT: number = +process.env.PORT || 3005;

// typeorm
const typeorm_default = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

const typeorm_conf = {
  dev: {
    ...typeorm_default,
    synchronize: true,
    logging: true
  },
  production: {
    ...typeorm_default,
    synchronize: false,
    logging: false
  }
};

const nodemailer_conf = {
  production: {
    transport: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    email_address: process.env.EMAIL_ADDRESS
  },
  test: {
    transport: {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'daryl.pollich93@ethereal.email',
        pass: 'F1tfC2HxbFTuwm1RFk'
      }
    },
    email_address: 'daryl.pollich93@ethereal.email'
  }
};

const NODEMAILER = nodemailer_conf[NODE_ENV === 'test' ? 'test' : 'production'];

const TYPEORM = typeorm_conf[NODE_ENV];

export {URL, NODE_ENV, PORT, TYPEORM, NODEMAILER };
