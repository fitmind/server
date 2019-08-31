import { IsBoolean } from 'class-validator';

class adminListingApproveDto {
  @IsBoolean()
  public approved: boolean;
}

export default adminListingApproveDto;
