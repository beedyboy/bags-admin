import backend from "../config";

export const getCards = async (status) => {
    return await backend.get(`card?status=${status}`);
};

export const addSingleCard = async (newCardData) => {
    const response = await backend.post("card/create", newCardData);
    return response;
};

export const addBulkCard = async (newCardData) => {
    const response = await backend.post("card/create-bulk", newCardData);
    return response;
};

export const suspendCard = async (id) => {
    return await backend.put(`card/suspend/${id}`, {});
};

export const activateCard = async (id, data) => {
    return await backend.put(`card/activate/${id}`, data);
};

export const requestFund = async (id, data) => {
    return await backend.post(`card/request-funds/${id}`, data);
};

export const rejectFundRequest = async (id) => {
    return await backend.put(`card/reject-fund-request/${id}`, {});
};

export const acceptFundRequest = async (id) => {
    const response = await backend.put(`card/approve-fund-request/${id}`);
    return response.data;
};

// Fetch card details by ID
export const getCardDetails = async (id) => {
    return await backend.get(`card/${id}`);
};


export const chargeCard = async (id, data) => {
    return await backend.post(`card/charge/${id}`, data);
};
// Fetch transactions for a card by ID
export const getCardTransactions = async (id) => {
    return await backend.get(`card/${id}/activity-report`);
};

export const fetchCardReport = async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await backend.get(`card/statistics/report?${params}`);
    return data;
};
  

export const fetchDashboardActivities = async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await backend.get(`card/statistics/activities?${params}`);
    return data;
};
  
  

export const getSingleCardByCode = async (code) => {
    const { data } = await backend.get(`card/search/barcode/${code}`);
    return data;
};
  