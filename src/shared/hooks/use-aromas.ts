import { useEffect } from "react";
import { AromasState, useAromasStore } from "../store";

export const useAromas = (): AromasState => {
  const aromasState = useAromasStore((state) => state);

  useEffect(() => {
    aromasState.fetchAromas();
  }, []);

  return aromasState;
};
