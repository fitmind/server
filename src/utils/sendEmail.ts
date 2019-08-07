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
  let html = '<h1>error</h1>';
  switch (type) {
    case 'USER_REGISTER':
      subject = 'Fitmind User Registration';
      htmlPath = './src/emails/user-register-email.html';
      break;
    default:
      html = '<h1>error</h1>';
  }
  if (htmlPath) {
    fs.readFile(htmlPath, 'utf8', (err, htmlString) => {
      if (err) {
        console.error(err);
      } else {
        let params = {
          Destination: {
            ToAddresses: sendTo
          },
          Message: {
            /* required */
            Body: {
              /* required */
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
          Source: EMAIL_SOURCE /* required */
        };
        const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        sendPromise
          .then(function(data) {
            console.log(`Email send successfully`);
            console.log(data);
          })
          .catch(function(err) {
            console.error(err, err.stack);
          });
      }
    });
  }
};

export default sendEmail;
