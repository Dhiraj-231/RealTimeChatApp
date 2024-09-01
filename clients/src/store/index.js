import { create } from "zustand";
import { createAuthSlice } from "./Slices/auth-slice.js";
import { createChatSlice } from "./Slices/Chat-slice.js";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));

