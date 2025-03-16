import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import {
  Box,
  Select,
  Button,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import { FilterModal } from "./FilterModal";

const eventTypes = [
  "AgentAdded",
  "Transfer",
  "BuyerApproved",
  "AddressFrozen",
  "Unpaused",
  "AgentRemoved",
];

const contracts = [
  { name: "Trusted Issuer Registry", address: import.meta.env.VITE_TRUSTED_ISSUER_REGISTRY_ADDRESS, collection: "financial_compliance" },
  { name: "Identity Registry", address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS, collection: "identity_registry" },
  { name: "Token", address: import.meta.env.VITE_TOKEN_ADDRESS, collection: "token_rwa" },
  { name: "Financial Compliance", address: import.meta.env.VITE_FINANCIAL_RWA_ADDRESS, collection: "financial_compliance" },
].filter((contract) => contract.address);

export const EventFilter = () => {
  const fetchHistory = useEventStore((state) => state.fetchHistory);
  const fetchHistoryByAddress = useEventStore((state) => state.fetchHistoryByAddress);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventType, setEventType] = useState("");
  const [selectedContract, setSelectedContract] = useState<{ name: string; address: string; collection: string } | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const applyFilters = () => {
    if (userAddress && !selectedContract) {
      fetchHistoryByAddress(userAddress, 1, 10, startDate, endDate);
      return;
    }

    if (!selectedContract) return;

    fetchHistory(selectedContract.collection, 1, 10, eventType, selectedContract.address, userAddress, startDate, endDate);
  };

  const resetFilters = () => {
    setEventType("");
    setSelectedContract(null);
    setUserAddress("");
    setStartDate("");
    setEndDate("");
    fetchHistory("token_rwa", 1, 10);
  };

  return (
    <Box p={2} bg="var(--background-dark)" borderRadius="lg" boxShadow="0px 0px 10px var(--accent)" mb={2} position="sticky" top="0" zIndex="1000">
      {/* 🔹 Linha 1 - Filtros principais */}
      <Flex wrap="wrap" gap={2} align="center">
        <Select
          placeholder="Contrato"
          value={selectedContract?.address || ""}
          onChange={(e) => {
            const contract = contracts.find((c) => c.address === e.target.value);
            setSelectedContract(contract || null);
          }}
          bg="var(--background-medium-opacity-1)"
          color="white"
          w="180px"
        >
          {contracts.map(({ name, address }) => (
            <option key={address} value={address}>
              {name} ({address.slice(0, 6)}...{address.slice(-4)})
            </option>
          ))}
        </Select>

        <Select
          placeholder="Evento"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          bg="var(--background-medium-opacity-1)"
          color="white"
          w="140px"
          isDisabled={!selectedContract}
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Button colorScheme="teal" onClick={applyFilters} size="sm">
          Aplicar
        </Button>

        <Button colorScheme="red" variant="outline" onClick={resetFilters} size="sm">
          Resetar
        </Button>

        <IconButton
          aria-label="Mais Filtros"
          icon={<FiSliders />}
          onClick={onOpen}
          colorScheme="purple"
          boxShadow="0px 0px 10px var(--purple)"
          size="sm"
        />
      </Flex>

      {/* 🔹 Linha 2 - Filtros ativos (agora menores e mais organizados) */}
      <Flex wrap="wrap" gap={1} mt={2}>
        {userAddress && (
          <Tag size="sm" bg="linear-gradient(135deg, #00ffff, #00ff7f)" color="black" boxShadow="0px 0px 8px #00ffff">
            <TagLabel>{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</TagLabel>
            <TagCloseButton onClick={() => setUserAddress("")} />
          </Tag>
        )}

        {startDate && (
          <Tag size="sm" bg="linear-gradient(135deg, #007fff, #00bfff)" color="black" boxShadow="0px 0px 8px #00bfff">
            <TagLabel>De: {startDate}</TagLabel>
            <TagCloseButton onClick={() => setStartDate("")} />
          </Tag>
        )}

        {endDate && (
          <Tag size="sm" bg="linear-gradient(135deg, #ffff00, #ffbf00)" color="black" boxShadow="0px 0px 8px #ffbf00">
            <TagLabel>Até: {endDate}</TagLabel>
            <TagCloseButton onClick={() => setEndDate("")} />
          </Tag>
        )}
      </Flex>

      {/* 🔥 Modal de filtros avançados */}
      <FilterModal
        isOpen={isOpen}
        onClose={onClose}
        setUserAddress={setUserAddress}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </Box>
  );
};
