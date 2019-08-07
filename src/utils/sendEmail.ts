import AWS from 'aws-sdk';
import fs from 'fs';
import CONFIG from '../config/config';

AWS.config.update({ region: 'eu-west-1' });

export const EMAILS = {
  USER_REGISTER: 'USER_REGISTER'
};

const EMAIL_SOURCE = CONFIG.emailSource;

const sendEmail = (type: string, sendTo: string[] = [], subject: string = '') => {
  let htmlPath;
  switch (type) {
    case 'USER_REGISTER':
      subject = 'Fitmind User Registration';
      htmlPath = './src/emails/user-register-email.html';
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
