import { IsNumber, IsPositive, IsString, IsUrl, Length, Max } from 'class-validator';

class createListingDto {
  @IsString()
  @Length(2, 40)
  public name: string;

  @IsString()
  @Length(4, 8)
  public price: string;

  @IsNumber()
  @IsPositive()
  @Max(4)
  public duration: number;

  @IsString()
  @IsUrl()
  public pictureUrl: string;

  @IsString()
  @Length(0, 300)
  public description: string;

  @IsString()
  public expertiseArea: string;

  @IsString()
  @Length(4, 8)
  public postCode: string;
}

export default createListingDto;
