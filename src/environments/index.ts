import * as dotenv from 'dotenv';

dotenv.config();

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

const TYPEORM = typeorm_conf[NODE_ENV];

export { NODE_ENV, PORT, TYPEORM };
