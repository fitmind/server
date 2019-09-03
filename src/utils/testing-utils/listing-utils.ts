import CONFIG from '../../config/config';
import ListingModel, { ListingModelType } from '../../api/listing/listing.model';
import { testingPictureUrl } from './testing-utils';

export const generateListingValidBody = (expertId?: string, approvedStatus?: string) => ({
  name: 'listing name',
  price: '100.00',
  duration: 1,
  description: 'some listing desc',
  pictureUrl: testingPictureUrl,
  expertiseArea: CONFIG.expertise.LIFE_COACH,
  postCode: 'NW13LR',
  createdByExpert: expertId,
  approvedStatus
});

export const generateListingForTesting = async (expertId?: string, approvedStatus?: string) => {
  return await ListingModel.create({ ...generateListingValidBody(expertId, approvedStatus) });
};

export const generateValidListingForTesting = async (expertId?: string) => {
  return await ListingModel.create({
    ...generateListingValidBody(expertId),
    approvedStatus: CONFIG.ApprovedStatus.APPROVED
  });
};

export const approveListingForTesting = async (listingId: string) => {
  await ListingModel.findByIdAndUpdate(listingId, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });
};

export const deleteListingFromTestById = async (id: string) => {
  await ListingModel.findByIdAndDelete(id);
};

export const approveListingInTesting = async (id: string) => {
  await ListingModel.findByIdAndUpdate(id, { approvedStatus: CONFIG.ApprovedStatus.APPROVED });
};

export const getListingFromDbById = async (id: string) => {
  return (await ListingModel.findById(id)) as ListingModelType;
};
