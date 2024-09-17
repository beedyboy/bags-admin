import { create } from "zustand";
import moment from "moment";

const useReconStore = create((set, get) => ({
    isStepOneFormOpened: false,
    isStepTwoFormOpened: false,
    upload: false,
    error: false,
    exist: false,
    loading: false,
    stage_one_initial_data: {},
    stage_two_initial_data: {},
    initial_data: {},
    revertId: null,
    sending: false,
    removed: false,
    reconcillations: [],
    finalReport: [],
    finales: [],
    brand: [],
    message: "",
    action: null,
    option: "All",
    startDate: "",
    endDate: "",
    finalDate: "",
    finalReportQuery: "",


    toggleUpload: () => set((state) => ({ upload: !state.upload })),

    toggleStepOneForm: () => set((state) => ({ isStepOneFormOpened: !state.isStepOneFormOpened })),
    toggleStepTwoForm: () => set((state) => ({ isStepTwoFormOpened: !state.isStepTwoFormOpened })),

    modifyStepOneData: (data, open) =>
    {
        const { credit_amount, credit_amount_to_use } = data;
      
        const defaultValues = {
            id: data.id,
            value_date: data.value_date,
            credit_amount,
            credit_amount_to_use: credit_amount_to_use,
            amount_used: 0,
            balance: 0,
            approved_one: false,
        };
        set({ stage_one_initial_data: defaultValues, isStepOneFormOpened: open })
    },
    modifyStepTwoData: (data, open) =>
    {
        const { credit_amount, amount_used } = data;
        const defaultValues = {
            id: data.id,
            value_date: data.value_date,
            credit_amount,
            amount_used,
            balance: 0,
            approved_one: data.approved_one,
            approved_two: false,
        };
        set({ stage_two_initial_data: defaultValues, isStepTwoFormOpened: open })
    },
    setFinalReportDate: (date) => set({ finalDate: date }),
    setFinalReportQuery: (query) => set({ finalReportQuery: query }),
    setRevertId: (id) => set({ revertId: id }),

    resetProperty: (key, value) => set({ [key]: value }),

    filterProperty: (option, data) => {
        if (option === "All") {
            set({ option, startDate: "", endDate: "" });
        } else if (option === "Filter") {
            set({
                option,
                startDate: moment(data[0]).format("DD-MM-YYYY"),
                endDate: moment(data[1]).format("DD-MM-YYYY"),
            });
        }
    },

    stats: () => get().reconcillations.length || 0,
}));

export default useReconStore;
