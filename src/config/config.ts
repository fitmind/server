export enum expertise {
  PERSONAL_COACH = 'PERSONAL_COACH',
  YOGA_COACH = 'YOGA_COACH',
  NUTRITIONIST = 'NUTRITIONIST',
  LIFE_COACH = 'LIFE_COACH'
}

const CONFIG = {
  expertise,
  routes: {
    user: {
      signUp: '/user/register'
    }
  }
};

export default CONFIG;
