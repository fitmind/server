import AWS from 'aws-sdk';
import fs from 'fs';
import CONFIG from '../../config/config';

AWS.config.update({ region: 'eu-west-1' });

export const EMAILS = {
  USER_REGISTER: 'USER_REGISTER',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  EXPERT_APPROVE: 'EXPERT_APPROVE',
  EXPERT_DENIED: 'EXPERT_DENIED',
  LISTING_APPROVE: 'LISTING_APPROVE',
  LISTING_DENIED: 'LISTING_DENIED'
};

const EMAIL_SOURCE = CONFIG.emailSource;

const sendEmail = (type: string, sendTo: string[] = [], subject: string = '') => {
  let htmlPath;
  switch (type) {
    case 'USER_REGISTER':
      subject = 'Fitmind: User Registration Confirmation';
      htmlPath = './src/emails/user-register-email.html';
      break;
    case 'EXPERT_APPROVE':
      subject = 'Fitmind: You have been approved to start using the platform';
      htmlPath = './src/emails/expert-approve-email.html';
      break;
    case 'EXPERT_DENIED':
      subject = 'Fitmind: Sorry but you have been declined to use the platform';
      htmlPath = './src/emails/expert-decline-email.html';
      break;
    case 'LISTING_APPROVE':
      subject = 'Fitmind: Your listing has been approved !';
      htmlPath = './src/emails/listing-approve-email.html';
      break;
    case 'LISTING_DENIED':
      subject = 'Fitmind: Sorry but your listing has been declined';
      htmlPath = './src/emails/listing-decline-email.html';
    case 'BOOKING_CONFIRMATION':
      htmlPath = './src/emails/booking-confirmation-email.html';
      break;
    default:
      return;
  }
  if (htmlPath) {
    fs.readFile(htmlPath, 'utf8', (err, htmlString) => {
      if (err) {
        return;
      } else {
        let params = {
          Destination: {
            ToAddresses: sendTo
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: htmlString
              }
            },
            Subject: {
              Charset: 'UTF-8',
              Data: subject
            }
          },
          Source: EMAIL_SOURCE
        };
        const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        sendPromise
          .then(function() {
            // console.log(`Email send successfully`);
            // console.log(data);
          })
          .catch(function() {
            // console.error(err, err.stack);
          });
      }
    });
  }
};

export default sendEmail;
