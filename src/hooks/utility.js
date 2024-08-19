import moment from "moment";

export const useFormattedDate = (date, format) => moment(date).format(format);
