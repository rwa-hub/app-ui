import { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";

const EventTab = () => {
  const [activeTab, setActiveTab] = useState("realTime");
  const realTimeEvents = useEventStore((state) => state.realTimeEvents);
  const historyEvents = useEventStore((state) => state.historyEvents);
  const fetchHistory = useEventStore((state) => state.fetchHistory);
  const connectWebSocket = useEventStore((state) => state.connectWebSocket);

  useEffect(() => {
    connectWebSocket();
    fetchHistory("token_rwa", 1, 10);
  }, []);

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`p-2 px-4 ${
            activeTab === "realTime" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab("realTime")}
        >
          🟢 Tempo Real
        </button>
        <button
          className={`p-2 px-4 ${
            activeTab === "history" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          📜 Histórico
        </button>
      </div>

      {/* Conteúdo */}
      <div className="mt-4">
        {activeTab === "realTime" ? (
          <div>
            {realTimeEvents.length === 0 ? (
              <p>🔴 Nenhum evento em tempo real.</p>
            ) : (
              realTimeEvents.map((event, idx) => (
                <div key={idx} className="p-2 border-b">
                  <p>📌 {event.eventType}</p>
                  <p>⏳ {new Date(event.timestamp).toLocaleString()}</p>
                  <p>🔗 {event.transactionHash}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {historyEvents.length === 0 ? (
              <p>📜 Nenhum histórico encontrado.</p>
            ) : (
              historyEvents.map((event, idx) => (
                <div key={idx} className="p-2 border-b">
                  <p>📌 {event.eventType}</p>
                  <p>⏳ {new Date(event.timestamp).toLocaleString()}</p>
                  <p>🔗 {event.transactionHash}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTab;
