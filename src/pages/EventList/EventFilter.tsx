import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Box, Select, Button, HStack } from "@chakra-ui/react";

const eventTypes = [
  "AgentAdded",
  "Transfer",
  "BuyerApproved",
  "AddressFrozen",
  "Unpaused",
  "AgentRemoved",
];

// 🔥 Mapeando contratos para coleções do MongoDB
const contracts = [
  { name: "Trusted Issuer Registry", address: import.meta.env.VITE_TRUSTED_ISSUER_REGISTRY_ADDRESS, collection: "financial_compliance" },
  { name: "Claim Topics Registry", address: import.meta.env.VITE_CLAIM_TOPICS_REGISTRY_ADDRESS, collection: "financial_compliance" },
  { name: "Identity Registry Storage", address: import.meta.env.VITE_IDENTITY_REGISTRY_STORAGE_ADDRESS, collection: "ident_registry_storage" },
  { name: "Modular Compliance", address: import.meta.env.VITE_MODULAR_COMPLIANCE_ADDRESS, collection: "financial_compliance" },
  { name: "Identity Registry", address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS, collection: "identity_registry" },
  { name: "Identity", address: import.meta.env.VITE_IDENTITY_ADDRESS, collection: "identity_registry" },
  { name: "Token", address: import.meta.env.VITE_TOKEN_ADDRESS, collection: "token_rwa" },
  { name: "Financial Compliance", address: import.meta.env.VITE_FINANCIAL_RWA_ADDRESS, collection: "financial_compliance" },
].filter((contract) => contract.address); 

export const EventFilter = () => {
  const fetchHistory = useEventStore((state) => state.fetchHistory);
  const [eventType, setEventType] = useState("");
  const [selectedContract, setSelectedContract] = useState<{ address: string; collection: string } | null>(null);


  const applyFilters = () => {
    if (!selectedContract) return;
    fetchHistory(selectedContract.collection, 1, 10, eventType);
  };


  const resetFilters = () => {
    setEventType("");
    setSelectedContract(null);
    fetchHistory("token_rwa", 1, 10);
  };

  return (
    <Box p={4} bg="gray.800" borderRadius="md" boxShadow="md" mb={4}>
      <HStack spacing={4}>

        <Select
          placeholder="Filtrar por contrato"
          value={selectedContract?.address || ""}
          onChange={(e) => {
            const contract = contracts.find((c) => c.address === e.target.value);
            setSelectedContract(contract || null);
          }}
          bg="gray.700"
          color="white"
        >
          {contracts.map(({ name, address }) => (
            <option key={address} value={address}>
              {name} ({address.slice(0, 6)}...{address.slice(-4)})
            </option>
          ))}
        </Select>


        <Select
          placeholder="Filtrar por evento"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          bg="gray.700"
          color="white"
          isDisabled={!selectedContract} 
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        {/* 🔍 Botão para aplicar filtros */}
        <Button colorScheme="teal" onClick={applyFilters} isDisabled={!selectedContract}>
          Aplicar Filtros
        </Button>

        {/* ♻️ Botão para resetar */}
        <Button colorScheme="red" variant="outline" onClick={resetFilters}>
          Resetar
        </Button>
      </HStack>
    </Box>
  );
};
