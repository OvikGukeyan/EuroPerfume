'use client'
import { createContext, useContext } from "react";

interface ModalContextType {
  isModal: boolean;
}

export const ModalContext = createContext<ModalContextType>({ isModal: false });

export const useModalContext = () => useContext(ModalContext);