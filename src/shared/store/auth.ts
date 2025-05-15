import { User } from "@prisma/client";
import { create } from "zustand";
import { Api } from "../services/api-client";

export interface AuthState {
    user: User | null;
    getUser: () => void;
    logout: () => void;
}
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    getUser: async () => {
        try {
            const data = await Api.auth.getMe();
            set({ user: data });
        } catch (error) {
            console.error(error);
        }
    },
    logout: () => set({ user: null }),
}));