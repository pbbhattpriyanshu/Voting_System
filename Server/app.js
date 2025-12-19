import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connect from './src/config/mongodb.config.js';
import auth from './src/routes/auth.route.js';
import candidate from './src/routes/candidate.route.js';
import voting from './src/routes/voting.route.js';

const app = express();
connect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
app.get('/', (req, res) => {
  res.send('Welcome to the Voting System API');
});
app.use('/voteadhikar/auth', auth);
app.use('/voteadhikar/candidate', candidate);
app.use('/voteadhikar/voting', voting)

export default app;