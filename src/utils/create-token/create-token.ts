import CONFIG from '../../config/config';
import * as jwt from 'jsonwebtoken';

const createUserToken = (id: string) => {
  const expiresIn = CONFIG.authTokenExpiryDate;
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id }, secret || '', { expiresIn });
};

export default createUserToken;
