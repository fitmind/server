import AdminModel, { AdminModelType } from '../../api/admin/admin.model';
import encryptPassword from '../encrypt-password/encrypt-password';
import { userTestEmail, userTestPassword } from './testing-utils';

export const generateAdminValidLogin = (email: string = userTestEmail, password: string = userTestPassword) => ({
  email,
  password
});

export const createAdmin = async (email: string, password: string): Promise<AdminModelType> => {
  const hashedPassword = await encryptPassword(password);
  return await AdminModel.create({ email, password: hashedPassword });
};

export const deleteAdminByEmail = async (email: string) => {
  await AdminModel.findOneAndDelete({ email });
};
