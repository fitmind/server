import ListingModel, { ListingModelType } from '../../api/listing/listing.model';
import { testingPictureUrl } from './testing-utils';
import CONFIG from '../../config/config';

export function getRandomPrice(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return `${Math.floor(Math.random() * (max - min + 1)) + min}.00`;
}

export const generateListingValidBody = (expertId?: string, approvedStatus?: string, expertise?: string) => ({
  name: 'listing name',
  description: 'some listing desc',
  pictureUrl: testingPictureUrl,
  price: 150,
  expertiseArea: expertise || CONFIG.expertise.LIFE_COACH,
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
