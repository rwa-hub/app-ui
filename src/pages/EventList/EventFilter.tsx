import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Box, Select, Button, HStack } from "@chakra-ui/react";

const eventTypes = ["AgentAdded", "Transfer", "BuyerApproved", "AddressFrozen", "Unpaused"];
const contractAddresses = [
  "0x2078faf714fb3727a66bc10f7a9690b5a16cd0bb",
  "0xf235bb30ad375f279248aafc89f4a92899a900de",
];

export const EventFilter = () => {
  const fetchHistory = useEventStore((state) => state.fetchHistory);
  const [eventType, setEventType] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const applyFilters = () => {
    fetchHistory("token_rwa", 1, 10, eventType, contractAddress);
  };

  return (
    <Box p={3} bg="gray.700" borderRadius="md" mb={4}>
      <HStack spacing={4}>
        <Select
          placeholder="Tipo de Evento"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Contrato"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        >
          {contractAddresses.map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </Select>

        <Button colorScheme="teal" onClick={applyFilters}>
          Aplicar Filtros
        </Button>
      </HStack>
    </Box>
  );
};
