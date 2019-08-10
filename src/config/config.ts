export enum expertise {
  PERSONAL_COACH = 'PERSONAL_COACH',
  YOGA_COACH = 'YOGA_COACH',
  NUTRITIONIST = 'NUTRITIONIST',
  LIFE_COACH = 'LIFE_COACH'
}

export enum UserTypes {
  CUSTOMER = 'CUSTOMER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN'
}

const CONFIG = {
  authTokenExpiryDate: 10000000000000,
  cookies: {
    user: 'X-Fitmind-Authorization',
    expert: 'X-Fitmind--Expert-Authorization',
    admin: 'X-Fitmind-Admin-Authorization'
  },
  expertise,
  UserTypes,
  routes: {
    user: {
      signUp: '/user/register',
      login: '/user/login',
      me: '/user/me',
      logout: '/user/logout'
    }
  },
  emailSource: 'hello.fitmind@gmail.com'
};

export default CONFIG;
