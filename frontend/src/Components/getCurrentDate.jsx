import moment from "moment";

const dateNow = moment().utc();

export const getCurrentDate = () => {
    return moment().utc().set('hour', dateNow.hour() + 5).set('minute', dateNow.minute() + 30);
}