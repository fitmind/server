import { IsBoolean } from 'class-validator';

class adminExpertApproveDto {
  @IsBoolean()
  public approved: boolean;
}

export default adminExpertApproveDto;
