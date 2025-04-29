import { Note } from "@prisma/client";
import { create } from "zustand";
import { Api } from "../services/api-client";

export type NoteValues = {
    labelRu: string;
    labelDe: string;
}
export interface NotesState {
    notes: Note[];
    loading: boolean;
    error: boolean;

    fetchNotes: () => Promise<void>;
    createNote: (note: NoteValues) => Promise<void>;
}

export const useNotesStore = create<NotesState>()((set) => ({
    notes: [],
    loading: true,
    error: false,

    fetchNotes: async () => {
        try {
            set({ loading: true, error: false });
            const data = await Api.notes.fetchNotes();
            set({ notes: data });
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    createNote: async (note: NoteValues) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.notes.createNote(note);
            set((state) => ({
                notes: [...state.notes, data]  
              }));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },
}));