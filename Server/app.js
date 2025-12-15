import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connect from './src/config/mongodb.config.js';

const app = express();
connect();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
app.get('/', (req, res) => {
  res.send('Welcome to the Voting System API');
});


export default app;