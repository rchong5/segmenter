import express from 'express';
import morgan from 'morgan';
import staffRouter from './routes/staff.js';

const app = express();

const PORT = 25000;


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/staff', staffRouter);





app.listen(PORT, () => 
{
   console.log(`Segmenter API is running on port ${PORT}`);
});

