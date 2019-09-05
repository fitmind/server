import { Validate } from 'class-validator';
import { ValidPageNumber } from '../../../utils/validate-page-number/validate-page-number';
import { ValidSize } from '../../../utils/validate-size/validate-size';
import { ValidPrice } from '../../../utils/validate-price/validate-price';
import { ValidExpertiseGetListings } from '../../../utils/validate-expertise-get-listings/validate-expertise-get-listings';

class getListingsDto {
  @Validate(ValidPageNumber)
  public page: String;

  @Validate(ValidSize)
  public size: String;

  @Validate(ValidPrice)
  public min_price: String;

  @Validate(ValidPrice)
  public max_price: String;

  @Validate(ValidExpertiseGetListings)
  public expertise: string;
}

export default getListingsDto;
