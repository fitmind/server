import * as mongoose from 'mongoose';
import CONFIG from '../../config/config';
import AdminInterface from '../../interfaces/admin.interface';

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdTimeStamp: { type: Date, default: Date.now }
});

export type AdminModelType = AdminInterface & mongoose.Document;

const AdminModel = mongoose.model<AdminModelType>(CONFIG.modelNames.admin, AdminSchema);

export default AdminModel;
