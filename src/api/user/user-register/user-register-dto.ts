import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { ValidExpertise } from '../../../utils/validateExpertise';

class userRegisterDto {
  @IsString()
  @Length(2, 20)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @Length(6, 25)
  public password: string;

  @IsString()
  @Length(0, 300)
  public description: string;

  @Validate(ValidExpertise)
  public interestedInExpertiseAreas: string[];
}

export default userRegisterDto;
