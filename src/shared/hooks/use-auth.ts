import { useEffect } from "react";
import { useAuthStore } from "../store";

export const useAuth = () => {
    const authState = useAuthStore((state) => state);
    
    useEffect(() => {
        authState.getUser();
    }, []);
    
    return authState;
}