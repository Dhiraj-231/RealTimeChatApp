export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectChatMessages: [],
    directMessagesContact: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
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