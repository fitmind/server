require('dotenv').config();
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import createApp from './App';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 9999;

if (process.env.NODE_ENV === 'production') {
  console.log(process.env);
}

mongoose
  .connect(process.env.mongoUrl || '', { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected');
    const app = createApp(express());

    app.listen(PORT, () => {
      console.log(`Magic happening on port ${PORT}`);
    });
  })
  .catch(err => console.log(`Error connecting to MongoDB ${err}`));
