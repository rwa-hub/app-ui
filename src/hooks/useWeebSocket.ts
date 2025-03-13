// src/hooks/useWebSocket.ts
import { useEffect } from 'react';

const useWebSocket = (onEventReceived: (event: any) => void) => {
  useEffect(() => {
    // Substitua pela URL do seu servidor WebSocket
    const socket = new WebSocket('wss://seu-servidor-websocket.com');

    socket.onmessage = (message) => {
      const event = JSON.parse(message.data);
      onEventReceived(event);
    };

    return () => {
      socket.close();
    };
  }, [onEventReceived]);
};

export default useWebSocket;
