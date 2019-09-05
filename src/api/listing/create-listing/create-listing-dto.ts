import { IsString, IsUrl, Length, Validate } from 'class-validator';
import { ValidExpertiseGetListings } from '../../../utils/validate-expertise-get-listings/validate-expertise-get-listings';

class createListingDto {
  @IsString()
  @Length(2, 40)
  public name: string;

  @IsString()
  @Length(4, 8)
  public price: string;

  @IsString()
  @IsUrl()
  public pictureUrl: string;

  @IsString()
  @Length(0, 300)
  public description: string;

  @IsString()
  @Validate(ValidExpertiseGetListings)
  public expertiseArea: string;

  @IsString()
  @Length(4, 8)
  public postCode: string;
}

export default createListingDto;
