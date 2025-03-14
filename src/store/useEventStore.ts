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
  fetchHistory: (collection: string, page: number, limit: number) => Promise<void>;
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

  // 🔥 Buscar histórico da API
  fetchHistory: async (collection, page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:8080/api/events", {
        params: { collection, page, limit },
      });

      set({
        historyEvents: response.data.events,
        totalPages: Math.ceil(response.data.total / limit),
      });
    } catch (error) {
      console.error("❌ Erro ao buscar histórico:", error);
    } finally {
      set({ loading: false });
    }
  },

  // 🔵 Adicionar eventos em tempo real
  addRealTimeEvent: (event: EventData) => {
    set((state) => ({
      realTimeEvents: [...state.realTimeEvents, event].slice(-50),
    }));
  },

  // ⚡ Conectar ao Socket.IO (http://)
  connectSocketIO: () => {
    console.log("🔌 Tentando conectar ao Socket.IO...");

    const socket: Socket = io("http://localhost:8080", { path: "/socket.io/" });

    socket.on("connect", () => {
      console.log("✅ Socket.IO conectado!");
      socket.emit("message", "Cliente conectado ao servidor!");
    });

    socket.on("event", (data: EventData) => {
      console.log("📩 Novo evento via Socket.IO:", data);
      get().addRealTimeEvent(data);
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
        const data: EventData = JSON.parse(event.data);
        console.log("📩 Novo evento via WebSocket:", data);
        get().addRealTimeEvent(data);
      } catch (error) {
        console.error("❌ Erro ao processar evento:", error);
      }
    };

    socket.onclose = () => {
      console.warn("❌ WebSocket desconectado. Tentando reconectar...");
      setTimeout(get().connectWebSocket, 3000); // Tenta reconectar após 3 segundos
    };

    socket.onerror = (error) => {
      console.error("🚨 Erro no WebSocket:", error);
    };
  },

  // 📌 Mudar página atual
  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },
}));
