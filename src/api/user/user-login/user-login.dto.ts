import { IsEmail, IsString, Length } from 'class-validator';

class userLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  @Length(6, 25)
  public password: string;
}

export default userLoginDto;
