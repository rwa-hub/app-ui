import { useState, useMemo } from "react";
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

// Definindo o tipo para as coleções de contratos
type ContractCollection = 
  | "financial_compliance" 
  | "identity_registry" 
  | "identity_registry_storage" 
  | "modular_compliance" 
  | "registry_md_compliance" 
  | "token_rwa";

// Mapeamento de eventos por tipo de contrato
const contractEvents: Record<ContractCollection, string[]> = {
  financial_compliance: [
    "BuyerApproved",
    "ComplianceBound",
    "ComplianceCheckFailedEvent",
    "ComplianceCheckPassed",
    "ComplianceUnbound",
    "Initialized",
    "OwnershipTransferred"
  ],
  identity_registry: [
    "AgentAdded",
    "AgentRemoved",
    "ClaimTopicsRegistrySet",
    "CountryUpdated",
    "IdentityRegistered",
    "IdentityRemoved",
    "IdentityStorageSet",
    "IdentityUpdated",
    "Initialized",
    "OwnershipTransferred",
    "TrustedIssuersRegistrySet"
  ],
  identity_registry_storage: [
    "AgentAdded",
    "AgentRemoved",
    "CountryModified",
    "IdentityModified",
    "IdentityRegistryBound",
    "IdentityRegistryUnbound",
    "IdentityStored",
    "IdentityUnstored",
    "Initialized",
    "OwnershipTransferred"
  ],
  modular_compliance: [
    "Initialized",
    "ModuleAdded",
    "ModuleInteraction",
    "ModuleRemoved",
    "OwnershipTransferred",
    "TokenBound",
    "TokenUnbound"
  ],
  registry_md_compliance: [
    "AverbacaoAdded",
    "ComplianceBound",
    "ComplianceUnbound",
    "Initialized",
    "OwnershipTransferred",
    "PropertyRegistered",
    "PropertyTransferred",
    "PropertyUpdated"
  ],
  token_rwa: [
    "Approval",
    "AuthorizedOperator",
    "Burned",
    "ComplianceAdded",
    "ComplianceRemoved",
    "ControllerTransfer",
    "ControllerRedemption",
    "Initialized",
    "Minted",
    "OwnershipTransferred",
    "Paused",
    "RevokedOperator",
    "Transfer",
    "Unpaused"
  ]
};

// Definindo o tipo para os contratos
interface Contract {
  name: string;
  address: string;
  collection: ContractCollection;
}

const contracts: Contract[] = [
  { name: "Trusted Issuer Registry", address: import.meta.env.VITE_TRUSTED_ISSUER_REGISTRY_ADDRESS, collection: "financial_compliance" },
  { name: "Identity Registry", address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS, collection: "identity_registry" },
  { name: "Token", address: import.meta.env.VITE_TOKEN_ADDRESS, collection: "token_rwa" },
  { name: "Financial Compliance", address: import.meta.env.VITE_FINANCIAL_RWA_ADDRESS, collection: "financial_compliance" },
].filter((contract) => contract.address) as Contract[];

export const EventFilter = () => {
  const fetchHistory = useEventStore((state) => state.fetchHistory);
  const fetchHistoryByAddress = useEventStore((state) => state.fetchHistoryByAddress);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventType, setEventType] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const availableEvents = useMemo(() => {
    if (!selectedContract) return [];
    return contractEvents[selectedContract.collection] || [];
  }, [selectedContract]);

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

  // Limpar o tipo de evento quando o contrato muda
  const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contract = contracts.find((c) => c.address === e.target.value);
    setSelectedContract(contract || null);
    setEventType("");
  };

  return (
    <Box p={2} bg="var(--background-dark)" borderRadius="lg" boxShadow="0px 0px 10px var(--accent)" mb={2} position="sticky" top="0" zIndex="1000">
      {/* 🔹 Linha 1 - Filtros principais */}
      <Flex wrap="wrap" gap={2} align="center">
        <Select
          placeholder="Contrato"
          value={selectedContract?.address || ""}
          onChange={handleContractChange}
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
          w="180px"
          isDisabled={!selectedContract}
        >
          {availableEvents.map((type: string) => (
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

        {selectedContract && (
          <Tag size="sm" bg="linear-gradient(135deg, #ff00ff, #9932cc)" color="black" boxShadow="0px 0px 8px #ff00ff">
            <TagLabel>{selectedContract.name}</TagLabel>
            <TagCloseButton onClick={() => {
              setSelectedContract(null);
              setEventType("");
            }} />
          </Tag>
        )}

        {eventType && (
          <Tag size="sm" bg="linear-gradient(135deg, #ff8c00, #ff4500)" color="black" boxShadow="0px 0px 8px #ff8c00">
            <TagLabel>Evento: {eventType}</TagLabel>
            <TagCloseButton onClick={() => setEventType("")} />
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
