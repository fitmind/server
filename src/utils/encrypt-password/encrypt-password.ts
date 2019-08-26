import * as bcrypt from 'bcrypt';

async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export default encryptPassword;
