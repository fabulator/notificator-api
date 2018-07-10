// @flow
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

export default app;
