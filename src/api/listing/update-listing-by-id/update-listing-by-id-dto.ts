import { IsNumber, IsString, IsUrl, Length, Max, Min } from 'class-validator';

class updateListingDto {
  @IsString()
  @Length(2, 20)
  public name: string;

  @IsNumber()
  @Min(1)
  @Max(4000)
  public price: number;

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

export default updateListingDto;
