import { Box, Text, VStack } from "@chakra-ui/react";
import { TabSwitcher } from "@/components/TabSwitcher";
import { Pagination } from "@/components/Pagination";
import { EventItem } from "./EventItem";
import { EventFilter } from "./EventFilter";
import { useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";

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
    fetchHistory("identity_registry", currentPage, 10);

  }, [currentPage]);

  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <TabSwitcher tabs={["Tempo Real", "Histórico"]}>
      {/* 🔹 Tempo Real */}
      <Box flex="1" p={2} borderRadius="md" display="flex" flexDirection="column">
        <VStack spacing={4} align="stretch" overflowY="auto" flex="1">
          {(realTimeEvents ?? []).length > 0 ? (
            realTimeEvents.map((event) => <EventItem key={event.transactionHash} event={event} />)
          ) : (
            <Text color="gray.500">Aguardando eventos...</Text>
          )}
        </VStack>
      </Box>

      {/* 🔹 Histórico com filtros */}
      <Box flex="1" p={2} borderRadius="md" display="flex" flexDirection="column" h="80vh" bg="var(--background-app)"
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "30px",
          pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--background-app))",
        }}>
        <EventFilter />

        {loading ? (
          <Text color="gray.500">Carregando histórico...</Text>
        ) : (
          <VStack
            spacing={4}
            align="stretch"
            overflowY="auto"
            flex="1"
            position="relative"
          // bg="var(--background-app)" 

          >
            {(historyEvents ?? []).length > 0 ? (
              historyEvents.map((event) => <EventItem key={event.transactionHash} event={event} />)
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
