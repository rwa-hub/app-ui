import { create } from "zustand";
import axios from "axios";
import { EventData } from "./event-types";
import { io, Socket } from "socket.io-client";

interface EventStore {
  realTimeEvents: EventData[];
  historyEvents: EventData[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  eventType: string;
  contractAddress: string;
  fetchHistory: (collection: string, page: number, limit: number, eventType?: string, contractAddress?: string) => Promise<void>;
  setFilters: (eventType: string, contractAddress: string) => void;
  setCurrentPage: (page: number) => void;
  addRealTimeEvent: (event: EventData) => void;
  connectWebSocket: () => void;
  connectSocketIO: () => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  realTimeEvents: [],
  historyEvents: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  eventType: "",
  contractAddress: "",

  // 🔥 Buscar histórico da API (com filtros)
  fetchHistory: async (collection, page = 1, limit = 10, eventType = "", contractAddress = "") => {
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

  // 🔍 Aplicar filtros e recarregar histórico
  setFilters: (eventType, contractAddress) => {
    set({ eventType, contractAddress, currentPage: 1 });
    get().fetchHistory("token_rwa", 1, 10, eventType, contractAddress);
  },

  // 📌 Mudar página e carregar novos eventos automaticamente
  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    const { eventType, contractAddress } = get();
    get().fetchHistory("token_rwa", page, 10, eventType, contractAddress);
  },

  // 🔵 Adicionar eventos em tempo real
  addRealTimeEvent: (event: EventData) => {
    if (!event.eventType || !event.timestamp || !event.transactionHash) {
      return;
    }

    set((state) => ({
      realTimeEvents: [...state.realTimeEvents, event].slice(-50),
    }));
  },

  // ⚡ Conectar ao Socket.IO
  connectSocketIO: () => {
    console.log("🔌 Tentando conectar ao Socket.IO...");

    const socket: Socket = io("http://localhost:8080", { path: "/socket.io/" });

    socket.on("connect", () => {
      console.log("✅ Socket.IO conectado!");
      socket.emit("message", "Cliente conectado ao servidor!");
    });

    socket.on("event", (data: unknown) => {
      if (typeof data === "object" && data !== null && "eventType" in data) {
        console.log("📩 Novo evento via Socket.IO:", data);
        get().addRealTimeEvent(data as EventData);
      }
    });

    socket.on("disconnect", () => {
      console.warn("❌ Socket.IO desconectado. Tentando reconectar...");
    });

    socket.on("connect_error", (error) => {
      console.error("🚨 Erro na conexão do Socket.IO:", error);
    });
  },

  // 🔵 Conectar ao WebSocket puro (ws://)
  connectWebSocket: () => {
    console.log("🔌 Tentando conectar ao WebSocket...");

    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      console.log("✅ WebSocket conectado!");
      socket.send(JSON.stringify({ type: "subscribe", message: "Cliente conectado" }));
    };

    socket.onmessage = (event) => {
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

    socket.onclose = () => {
      console.warn("❌ WebSocket desconectado. Tentando reconectar...");
      setTimeout(get().connectWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error("🚨 Erro no WebSocket:", error);
    };
  },
}));
