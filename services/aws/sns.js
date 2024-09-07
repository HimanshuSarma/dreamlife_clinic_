const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({ region: process.env.AWS_REGION });

const publishMessage = async ({
    message,
    topicArn
}) => {
    const publishTextPromise = new AWS.SNS({ 
        apiVersion: "2010-03-31",
        credentials: {
            accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS
        } 
    })
    .publish({
        Message: message,
        TopicArn: topicArn
    })
    .promise();

    const promise = new Promise((resolve, reject) => {
        publishTextPromise
            .then(data => {
                console.log('resolved');
                resolve({
                    success: true,
                    payload: data
                });
            })
            .catch(err => {
                reject({
                    success: false,
                    error: err
                });
            });
    });

    const result = await promise;
    return result;
}

module.exports = {
    publishMessage
}
