import { create } from "zustand";
import axios from "axios";
import { EventData } from "./event-types";
import { io, Socket } from "socket.io-client";
import { createStandaloneToast } from "@chakra-ui/react";
import { statusColors } from "@/utils/toast-neon";

const { toast } = createStandaloneToast();

interface EventStore {
  realTimeEvents: EventData[];
  historyEvents: EventData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  eventType: string;
  contractAddress: string;
  socketInstance: WebSocket | null;
  fetchHistory: (
    collection: string,
    page: number,
    limit: number,
    eventType?: string,
    contractAddress?: string
  ) => Promise<void>;
  setFilters: (eventType: string, contractAddress: string) => void;
  setCurrentPage: (page: number) => void;
  addRealTimeEvent: (event: EventData) => void;
  connectWebSocket: () => void;
}

export const useEventStore = create<EventStore>((set, get) => {
  let wsInstance: WebSocket | null = null;

  return {
    realTimeEvents: [],
    historyEvents: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    eventType: "",
    contractAddress: "",
    socketInstance: null, 

    fetchHistory: async (
      collection,
      page = 1,
      limit = 10,
      eventType = "",
      contractAddress = ""
    ) => {
      set({ loading: true });

      try {
        const response = await axios.get("http://localhost:8080/api/events", {
          params: { collection, page, limit, eventType, contractAddress },
        });

        const totalItems = response.data.total ?? 0;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

        set({
          historyEvents: response.data.events,
          totalPages,
        });
      } catch (error) {
        console.error("❌ Erro ao buscar histórico:", error);
        set({ totalPages: 1 });
      } finally {
        set({ loading: false });
      }
    },

    setFilters: (eventType, contractAddress) => {
      set({ eventType, contractAddress, currentPage: 1 });
      get().fetchHistory("token_rwa", 1, 10, eventType, contractAddress);
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
      const { eventType, contractAddress } = get();
      get().fetchHistory("token_rwa", page, 10, eventType, contractAddress);
    },

    addRealTimeEvent: (event: EventData) => {
      if (!event.eventType || !event.timestamp || !event.transactionHash) {
        return;
      }

      // 🔥 Evita duplicação de eventos na UI
      set((state) => {
        if (state.realTimeEvents.some((e) => e.transactionHash === event.transactionHash)) {
          console.warn("⚠️ Evento já registrado, ignorando duplicata.");
          return state;
        }
        return { realTimeEvents: [...state.realTimeEvents, event].slice(-50) };
      });

      // 🔥 Exibe a notificação
      const eventColor = statusColors[event.eventType as keyof typeof statusColors] || "#ABC4FF";
      toast({
        title: `📩 Novo Evento Recebido!`,
        description: `🆔 ${event.eventType} - ${event.transactionHash.slice(0, 6)}...${event.transactionHash.slice(-4)}`,
        status: "info",
        position: "top-right",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          background: "var(--background-dark)",
          border: `2px solid ${eventColor}`,
          color: "var(--text-primary)",
          boxShadow: `0px 0px 15px ${eventColor}`,
        },
      });
    },

    connectWebSocket: () => {
      if (wsInstance) {
        console.warn("⚠️ WebSocket já conectado, ignorando nova conexão.");
        return;
      }

      console.log("🔌 Conectando ao WebSocket...");

      wsInstance = new WebSocket("ws://localhost:8080/ws");
      set({ socketInstance: wsInstance });

      wsInstance.onopen = () => {
        console.log("✅ WebSocket conectado!");
        wsInstance?.send(JSON.stringify({ type: "subscribe", message: "Cliente conectado" }));
      };

      wsInstance.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data === "object" && data !== null && "eventType" in data) {
            console.log("📩 Novo evento via WebSocket:", data);
            get().addRealTimeEvent(data as EventData);
          }
        } catch (error) {
          console.error("❌ Erro ao processar evento:", error);
        }
      };

      wsInstance.onclose = () => {
        console.warn("❌ WebSocket desconectado. Tentando reconectar em 3s...");
        wsInstance = null;
        set({ socketInstance: null });
        setTimeout(get().connectWebSocket, 3000);
      };

      wsInstance.onerror = (error) => {
        console.error("🚨 Erro no WebSocket:", error);
      };
    },
  };
});
