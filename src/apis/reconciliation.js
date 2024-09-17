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

export const approveStageTwo = async (id) => {
    const response = await backend.put(`${transaction}/approve-stage-two/${id}`);
    return response.data;
};

export const revertRecord = async (id) => {
    const response = await backend.post(`${transaction}/overturn/${id}`, {});
    return response.data;
};

export const getFinalStageList = async (query) => {
    const url = `${transaction}/final-report${query ? `?${query}` : ''}`;
    return await backend.get(url);
};
