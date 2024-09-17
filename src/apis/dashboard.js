import backend from "../config";

const page = 'dashboard';

export const getStats = async ({ startDate: start_date, endDate: end_date }) => {
    const response = await backend.get(`${page}/stats`, {
        params: {
            start_date,
            end_date,
        },
    });
    return response.data;
};

export const getClosedRecords = async (startDate, endDate) => {
    return await backend.get(`${page}/closed-records`,  {
        params: {
            startDate,
            endDate,
        },
    });
};

