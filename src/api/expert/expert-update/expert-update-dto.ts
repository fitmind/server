import { IsString, IsUrl, Length, Validate } from 'class-validator';
import { ValidExpertise } from '../../../utils/validate-expertise/validate-expertise';
import { ValidAvailability } from '../../../utils/validate-availability/validate-availability';

class expertUpdateDto {
  @IsString()
  @Length(2, 20)
  public name: string;

  @IsString()
  @Length(0, 300)
  public description: string;

  @IsString()
  @IsUrl()
  public pictureUrl: string;

  @Validate(ValidExpertise)
  public isAnExpertIn: string[];

  @Validate(ValidAvailability)
  public weeklyAvailability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}

export default expertUpdateDto;
