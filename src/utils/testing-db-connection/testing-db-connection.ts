import mongoose from 'mongoose';

export const setTestingDbConnection = async () => {
  await mongoose.connect(process.env.MONGO_TESTING_URL as string, {
    useNewUrlParser: true
  });
};

export const disconnectTestingDb = async () => {
  await mongoose.disconnect();
};
