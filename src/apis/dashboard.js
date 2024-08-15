import backend from "../config";

const page = 'dashboard/';

export const getStats = async () => {
    return await backend.get(`${page}/stats`);
};

