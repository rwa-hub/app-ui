import { Box, Text, VStack } from "@chakra-ui/react";
import { TabSwitcher } from "@/components/TabSwitcher";
import { Pagination } from "@/components/Pagination";
import { EventItem } from "./EventItem";
import { EventFilter } from "./EventFilter";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useRef } from "react";

export const EventList = () => {
  const {
    realTimeEvents,
    historyEvents,
    loading,
    currentPage,
    totalPages,
    fetchHistory,
    setCurrentPage,
    connectWebSocket,
  } = useEventStore();

  const hasConnectedWebSocket = useRef(false);

  useEffect(() => {
    fetchHistory("token_rwa", currentPage, 5 );
  }, [currentPage]);

  useEffect(() => {
    if (!hasConnectedWebSocket.current) {
      connectWebSocket();
      hasConnectedWebSocket.current = true;
    }
  }, []);

  return (
    <TabSwitcher tabs={["⏲️ Tempo Real", "🔍 Histórico"]}>
      <Box flex="1" borderRadius="md" display="flex" flexDirection="column">
        <VStack spacing={4} align="stretch" overflowY="auto" flex="1">
          {realTimeEvents.length > 0 ? (
            realTimeEvents.map((event) => <EventItem key={event.transactionHash} event={event} />)
          ) : (
            <Text color="gray.500">Aguardando eventos...</Text>
          )}
        </VStack>
      </Box>

      <Box flex="1" p={2} borderRadius="md" display="flex" flexDirection="column" h="80vh">
        <EventFilter />

        {loading ? (
          <Text color="gray.500">Carregando histórico...</Text>
        ) : (
          <VStack spacing={4} align="stretch" overflowY="auto" flex="1">
            {historyEvents.length > 0 ? (
              historyEvents.map((event) => <EventItem key={event.transactionHash} event={event} />)
            ) : (
              <Text color="gray.500">Nenhum evento encontrado.</Text>
            )}
          </VStack>
        )}

        {/* 🔥 Paginação Corrigida */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Box>
    </TabSwitcher>
  );
};
