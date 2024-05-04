const {
    publishMessage
} = require('../../services/aws/sns');

const sendSMS = async ({
    message,
    topicArn
}) => {
    const publishMessageRes = await publishMessage({
        message,
        topicArn
    });

    return publishMessageRes;
};

module.exports = {
    sendSMS
}