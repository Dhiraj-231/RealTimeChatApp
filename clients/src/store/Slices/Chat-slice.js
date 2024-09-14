export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectChatMessages: [],
    directMessagesContact: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectChatMessages) => set({ selectChatMessages }),
    setDirectMessagesContact: (directMessagesContact) => set({ directMessagesContact }),
    closeChat: () => set(
        {
            selectedChatData: undefined,
            selectedChatType: undefined,
            selectChatMessages: []
        }
    ),
    addMessage: (message) => {
        const selectedChatMessages = get().selectChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient:
                        selectedChatType === "channel"
                            ? message.recipient
                            : message.recipient._id,
                    sender:
                        selectedChatType === "channel"
                            ? message.sender
                            : message.sender._id
                }
            ]
        })
    }
})