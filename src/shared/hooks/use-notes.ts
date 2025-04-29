import { useEffect } from "react";
import { NotesState, NoteValues, useNotesStore } from "../store";
import { Note } from "@prisma/client";



export const useNotes = (): NotesState => {
    
    const notesState = useNotesStore((state) => state);
    
    useEffect(() => {
        notesState.fetchNotes()
    }, []);

    return notesState;
}