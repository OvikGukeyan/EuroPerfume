import { Note } from "@prisma/client";
import { axiosInstance } from "./instance";
import { NoteValues } from "../store/notes";

export const fetchNotes = async (): Promise<Note[]> => {
  return (await axiosInstance.get<Note[]>("/notes")).data;
};

export const createNote = async (data: NoteValues): Promise<Note> => {
  return (await axiosInstance.post<Note>("/notes", { data })).data;
};
