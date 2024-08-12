import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { NODE_ENV } from './environment';

const apiPath = path.join(
  __dirname,
  NODE_ENV === 'production' ? '../components/**/*.js' : '../components/**/*.ts'
);

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scraping System API',
      version: '1.0.0',
      description: 'API documentation for the Scraping System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: [apiPath],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
