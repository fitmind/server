export enum expertise {
  PERSONAL_COACH = 'PERSONAL_COACH',
  YOGA_COACH = 'YOGA_COACH',
  NUTRITIONIST = 'NUTRITIONIST',
  LIFE_COACH = 'LIFE_COACH'
}

const CONFIG = {
  authTokenExpiryDate: 10000000000000,
  cookies: {
    user: 'X-Fitmind-Authorization'
  },
  expertise,
  routes: {
    user: {
      signUp: '/user/register',
      login: '/user/login'
    }
  },
  emailSource: 'hello.fitmind@gmail.com'
};

export default CONFIG;
