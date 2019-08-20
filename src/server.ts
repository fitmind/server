require('dotenv').config();
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import createApp from './App';
import mongoose from 'mongoose';

const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;
console.log('----------------------------');
console.log(`Number of cores available: ${CONCURRENCY}`);
console.log('----------------------------');

console.log('----------------------------');
console.log(`NODE ENV: ${process.env.NODE_ENV}`);
console.log('----------------------------');

const PORT = process.env.PORT || 9999;

if (process.env.NODE_ENV === 'production') {
  console.log('----------------------------');
  console.log('ENV VARIABLES');
  console.log(process.env);
  console.log('----------------------------');
}

mongoose
  .connect(process.env.MONGO_URL || '', { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('MongoDB connected');
    const app = createApp(express());

    app.listen(PORT, () => {
      console.log(`Magic happening on port ${PORT}`);
    });
  })
  .catch(err => console.log(`Error connecting to MongoDB ${err}`));
