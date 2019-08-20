export const ListingCreationData = (expertId: string) => ({
  name: 'Listing name',
  description: 'some long string',
  pictureUrl: 'https://fitmind-dev.s3.eu-west-2.amazonaws.com/mock-images/daniel_photo.png',
  expertiseArea: 'PERSONAL_COACH',
  createdByExpert: expertId
});
