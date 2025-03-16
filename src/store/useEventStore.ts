import { create } from "zustand";
import axios from "axios";
import { EventData } from "./event-types";
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
    contractAddress?: string,
    userAddress?: string,
    startDate?: string,
    endDate?: string,
    txHash?: string
  ) => Promise<void>;
  fetchHistoryByAddress: (
    userAddress: string,
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  setFilters: (eventType: string, contractAddress: string) => void;
  setCurrentPage: (page: number) => void;
  addRealTimeEvent: (event: EventData) => void;
  connectWebSocket: () => void;
}

export const useEventStore = create<EventStore>((set, get) => {

  let wsInstance: WebSocket | null = null;
  let pingInterval: NodeJS.Timeout | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;
  let reconnectAttempts = 0;

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
      collection: string,
      page: number = 1,
      limit: number = 10,
      eventType: string = "",
      contractAddress: string = "",
      userAddress: string = "",
      startDate: string = "",
      endDate: string = ""
    ) => {
      set({ loading: true });
    
      try {
        let url = "http://localhost:8080/api/events";

        let params: Record<string, string | number> = {
          collection,
          page,
          limit,
          eventType,
          contractAddress,
          startDate,
          endDate,
        };
    

        if (userAddress) {
          url = `http://localhost:8080/api/events/${userAddress}`;
        } else {
          params["userAddress"] = userAddress;
        }
    
        const response = await axios.get(url, { params });
    
        const totalItems = response.data.total ?? 0;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;
    
        set({
          historyEvents: response.data.events ?? [],
          totalPages,
        });
      } catch (error) {
        console.error("❌ Erro ao buscar histórico:", error);
        set({ historyEvents: [], totalPages: 1 });
      } finally {
        set({ loading: false });
      }
    },

    fetchHistoryByAddress: async (userAddress, page = 1, limit = 10, startDate = "", endDate = "") => {
      set({ loading: true });

      try {
        const response = await axios.get(`http://localhost:8080/api/events/${userAddress}`, {
          params: { page, limit, startDate, endDate },
        });

        const totalItems = response.data.total ?? 0;
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

        set({
          historyEvents: response.data.events ?? [],
          totalPages,
        });
      } catch (error) {
        console.error("❌ Erro ao buscar eventos por endereço:", error);
        set({ historyEvents: [], totalPages: 1 });
      } finally {
        set({ loading: false });
      }
    },

    setFilters: (eventType, contractAddress) => {
      set({ eventType, contractAddress, currentPage: 1 });
      get().fetchHistory("token_rwa", 1, 5, eventType, contractAddress);
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
      const { eventType, contractAddress } = get();
      get().fetchHistory("token_rwa", page, 5, eventType, contractAddress);
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
      if (wsInstance && wsInstance.readyState !== WebSocket.CLOSED) {
        console.warn("⚠️ WebSocket já conectado, ignorando nova conexão.");
        return;
      }

      console.log("🔌 Tentando conectar ao WebSocket...");

      wsInstance = new WebSocket("ws://localhost:8080/ws");
      set({ socketInstance: wsInstance });

      wsInstance.onopen = () => {
        console.log("✅ WebSocket conectado!");
        wsInstance?.send(JSON.stringify({ type: "subscribe", message: "Cliente conectado" }));

        // 🔥 Reinicia as tentativas de reconexão ao conectar
        reconnectAttempts = 0;

        // 🔥 Mantém a conexão ativa enviando pings a cada 25s
        pingInterval = setInterval(() => {
          if (wsInstance?.readyState === WebSocket.OPEN) {
            wsInstance.send(JSON.stringify({ type: "ping" }));
            console.log("📡 Ping enviado ao WebSocket");
          }
        }, 25000); // PING a cada 25s
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

      wsInstance.onclose = (event) => {
        console.warn(`❌ WebSocket desconectado (${event.code}: ${event.reason}). Tentando reconectar...`);
        wsInstance = null;
        set({ socketInstance: null });

        if (pingInterval) {
          clearInterval(pingInterval);
          pingInterval = null;
        }

        // 🔥 Lógica de reconexão exponencial (2s → 4s → 8s até 30s máx.)
        const reconnectDelay = Math.min(2000 * 2 ** reconnectAttempts, 30000);
        reconnectAttempts++;

        console.log(`⏳ Tentando reconectar WebSocket em ${reconnectDelay / 1000}s...`);

        reconnectTimeout = setTimeout(get().connectWebSocket, reconnectDelay);
      };

      wsInstance.onerror = (error) => {
        console.error("🚨 Erro no WebSocket:", error);
      };
    },
  };
});
