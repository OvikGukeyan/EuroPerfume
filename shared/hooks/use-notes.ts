import { useEffect } from "react";
import { NoteValues, useNotesStore } from "../store";
import { Note } from "@prisma/client";

interface ReturnPeops {
    notes: Note[]
    loading: boolean
    error: boolean
    fetchNotes: () => Promise<void>
    createNote: (note: NoteValues) => Promise<void>
}

export const useNotes = (): ReturnPeops => {
    
    const notesState = useNotesStore((state) => state);
    
    useEffect(() => {
        notesState.fetchNotes()
    }, []);

    return notesState;
}