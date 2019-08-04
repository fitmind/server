import { IsEmail, IsString, Length } from 'class-validator';

class userRegisterDto {
  @IsString()
  @Length(2, 20)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @Length(6, 25)
  public password: string;
}

export default userRegisterDto;
