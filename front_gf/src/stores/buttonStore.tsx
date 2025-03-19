import { create } from "zustand";

interface ButtonState {
    loadingButtons: Record<string, boolean>;
    setLoading: (id: string, isLoading: boolean) => void;
}

export const useButtonStore = create<ButtonState>((set) => ({
    loadingButtons: {},
    setLoading: (id, isLoading) => set((state) => ({
        loadingButtons: {
            ...state.loadingButtons,
            [id]: isLoading
        }
    }))
}));