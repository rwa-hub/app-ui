import { useEffect } from "react";
import { useEventStore } from "@/store/useEventStore";

export const useWebSocketEvents = () => {
  const connectWebSocket = useEventStore((state) => state.connectWebSocket);

  useEffect(() => {
    connectWebSocket();
  }, []);
};
