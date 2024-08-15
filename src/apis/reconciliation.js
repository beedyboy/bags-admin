import backend from "../config";

const transaction = "/transaction-processing";
const reconciliation = "/reconciliation";

export const getStageOneList = async () => {
    return await backend.post(`${reconciliation}/filter`, {
        approved_one: false,
        approved_two: false
    });
};

export const getStageTwoList = async () => {
    return await backend.post(`${reconciliation}/filter`, {
        approved_one: true,
        approved_two: false
    });
};

export const uploadStatement = async (data) => {
    const response = await backend.post(`${transaction}/upload`, data);
    return response.data;
};

export const approveStageOne = async (id, data) =>
{
    const response = await backend.put(`${transaction}/approve/${id}`, data);
    return response.data;
};

export const approveStageTwo = async (id, data) => {
    const response = await backend.put(`${transaction}/approve-stage-two/${id}`, data);
    return response.data;
};

export const revertRecord = async (data) => {
    const response = await backend.post(`${transaction}/overturn`, data);
    return response.data;
};
