export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectChatMessages: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessage: (selectChatMessages) => set({ selectChatMessages }),
    closeChat: () => set(
        {
            selectedChatData: undefined,
            selectedChatType: undefined,
            selectChatMessages: []
        }
    ),
})