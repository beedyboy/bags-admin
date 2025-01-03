export const CardActivityTypeLabels = {
    fund_request: "Fund Request",
    load: "Load Card",
    purchase: "Purchase",
};

export const cardStats = [
    { title: "Active Cards", valueKey: "activeCards" },
    { title: "Inactive Cards", valueKey: "inactiveCards" },
    { title: "Funds Loaded", valueKey: "totalFundsLoaded", isCurrency: true },
    { title: "Funds Spent", valueKey: "totalFundsSpent", isCurrency: true },
    { title: "Funds Remaining", valueKey: "totalFundsRemaining", isCurrency: true },
];
