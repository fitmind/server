import { IsDateString } from 'class-validator';

class createBookingDto {
  @IsDateString()
  public time: string;
}

export default createBookingDto;
