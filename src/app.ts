import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import yourRouter from './routes/allRouter';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/api', yourRouter);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
