import { create } from "zustand";
import { Result } from "~/types";

interface ResultStore {
    result: Result | null;
    setResult: (result: Result) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
    result: null,
    setResult: (result: Result) => set({ result })
}));