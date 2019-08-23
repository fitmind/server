import { IsEmail, IsString, Length } from 'class-validator';

class adminLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  @Length(6, 25)
  public password: string;
}

export default adminLoginDto;
