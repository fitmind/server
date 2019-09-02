import AdminModel from './api/admin/admin.model';

require('dotenv').config();
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import createApp from './App';
import mongoose from 'mongoose';
import { createAdmin } from './utils/testing-utils/admin-utils';

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
    app.listen(PORT, async () => {
      console.log(`Magic happening on port ${PORT}`);
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminExists = await AdminModel.find({ email: adminEmail });
      if (!adminExists.length) {
        try {
          await createAdmin(adminEmail as string, process.env.ADMIN_PASSWORD as string);
        } catch (e) {
          console.error(`Error creating admin user ${e}`);
        }
      }
    });
  })
  .catch(err => console.log(`Error connecting to MongoDB ${err}`));
