const nodeCron = require('node-cron');
const moment = require('moment');

const {
    getToBeExpiredMedicinesController,
    setExpiryNotificationForMedicinesController
} = require('../../Controlers/MedicineController');

const {
    sendSMS
} = require('../../utils/messaging/sendSMS');

const {
    sendMailHandler
} = require('../../services/email/sendMail');

nodeCron.schedule('0 30 18 * * *', async () => {
    // setInterval(() => {
    //     (async () => {
            try {
                const getRunawayDate = (runwayDays) => {
                    const currDate = new Date();
                    currDate?.setDate(currDate.getDate() + runwayDays);
                    return currDate?.toISOString();
                }

                let validation;
                let handlerResponse;
                let batchesIds = [];
                let medicineExpiryNotificationParams = {
                    message: '',
                    subject: 'Medicine Expiry Alert!',
                    topicArn: process.env.AWS_SNS_MEDICINE_EXPIRY_NOTIFICATION_TOPIC
                };
            
                validation = await getToBeExpiredMedicinesController.validation({
                    input: {
                        runwayDate: getRunawayDate(30)
                    }
                });
            
                if (!validation?.success) {
                    return;
                }
            
                handlerResponse = await getToBeExpiredMedicinesController.handler({
                    input: {
                        runwayDate: getRunawayDate(30)
                    }
                });
            
                if (handlerResponse?.success && handlerResponse?.payload?.medicines?.length > 0) {
                    for (let i = 0; i < handlerResponse?.payload?.medicines?.length; i++) {
                        for (let j = 0; j < handlerResponse?.payload?.medicines?.[i]?.batches?.length; j++) {
                            if (!handlerResponse?.payload?.medicines?.[i]?.batches?.[j]?.isExpiryNotificationSent) {
                                batchesIds?.push(handlerResponse?.payload?.medicines?.[i]?.batches?.[j]?._id);
                                medicineExpiryNotificationParams.message +=
                                    `${handlerResponse?.payload?.medicines?.[i]?.name}, Batch ${j + 1}. exp date: ${
                                        moment(handlerResponse?.payload?.medicines?.[i]?.batches?.[j]?.expDate)
                                            ?.format('MMMM Do YYYY, h:mm:ss a')
                                    }\n`;
                            }
                        }
                    }
                }

                console.log(batchesIds, 'batchesIds');

                if (batchesIds?.length > 0) {
                    const sendMailRes = await sendMailHandler({
                        ...medicineExpiryNotificationParams,
                        recipients: ['sweetiehimanshu@gmail.com', 'maheshsarma123.321@gmail.com'],
                        body: medicineExpiryNotificationParams?.message
                    });

                    if (sendMailRes?.messageId) {
                        await setExpiryNotificationForMedicinesController.handler({
                            input: {
                                batches: batchesIds?.map(currBatchId => {
                                    return currBatchId?.toString?.();
                                })
                            }
                        });
                    }
                }
            } catch (err) {
                console.log(err, 'medicineExpiryAlert');
            }
    //     })();
    // }, 5000);
});