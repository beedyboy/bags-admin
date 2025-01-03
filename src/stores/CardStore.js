import { create } from "zustand";

const useCardStore = create((set) => ({
    cards: [],
    // Modal state management
    isActivateModalOpen: false,
    isRequestFundsModalOpen: false,
    isChargeCardModalOpen: false,
    activeCardId: null,
    singleCard: {},
    transactionPreview: {},
    isPreviewModalOpen: false,

    setCards: (cards) => set({ cards }),

    updateCard: (updatedCard) =>
        set((state) => ({
            cards: state.cards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
        })),

    removeCard: (cardId) =>
        set((state) => ({
            cards: state.cards.filter((card) => card.id !== cardId),
        })),

    toggleActivateModal: (cardId) =>
        set((state) => ({
            isActivateModalOpen: !state.isActivateModalOpen,
            activeCardId: state.isActivateModalOpen ? null : cardId,
        })),
    toggleRequestFundsModal: (data) =>
        set((state) => ({
            activeCardId: state.isRequestFundsModalOpen ? null : data?.id,
            singleCard: data,
            isRequestFundsModalOpen: !state.isRequestFundsModalOpen,
        })),
    toggleChargeCardModal: (data) =>
        set((state) => ({
            activeCardId: state.isChargeCardModalOpen ? null : data?.id,
            singleCard: data,
            isChargeCardModalOpen: !state.isChargeCardModalOpen,
        })),
    setTransactionPreview: (data) =>
        set((state) => ({
            transactionPreview: data ? data : {},
            isChargeCardModalOpen: false,
            isPreviewModalOpen: !state.isPreviewModalOpen,
        })),
}));

export default useCardStore;
