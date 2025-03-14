import { useEffect } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Box, Text, VStack } from "@chakra-ui/react";
import { TabSwitcher } from "@/components/TabSwitcher";
import { Pagination } from "@/components/Pagination";
import { EventItem } from "./EventItem";
import { EventFilter } from "./EventFilter";

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

  useEffect(() => {
    fetchHistory("token_rwa", currentPage, 10);
  }, [currentPage]);

  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <TabSwitcher tabs={["Tempo Real", "Histórico"]}>
      {/* 🔹 Tempo Real */}
      <Box flex="1" overflowY="auto" p={2} borderRadius="md">
        <VStack spacing={4} align="stretch">
          {realTimeEvents.length > 0 ? (
            realTimeEvents.map((event) => <EventItem key={event._id} event={event} />)
          ) : (
            <Text color="gray.500">Aguardando eventos...</Text>
          )}
        </VStack>
      </Box>

      {/* 🔹 Histórico com filtros */}
      <Box flex="1" overflowY="auto" p={2} borderRadius="md">
        <EventFilter />
        
        {loading ? (
          <Text color="gray.500">Carregando histórico...</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {historyEvents.length > 0 ? (
              historyEvents.map((event) => <EventItem key={event._id} event={event} />)
            ) : (
              <Text color="gray.500">Nenhum evento encontrado.</Text>
            )}
          </VStack>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Box>
    </TabSwitcher>
  );
};
