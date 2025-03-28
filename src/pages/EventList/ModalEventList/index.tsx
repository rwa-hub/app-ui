import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface ModalNeonProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  status?: "success" | "error" | "warning" | "neutral" | "focus";
  event: Record<string, unknown>;
}

const statusColors = {
  success: "var(--semanticSuccess)",
  error: "var(--semanticError)",
  warning: "var(--semanticWarning)",
  neutral: "var(--semanticNeutral)",
  focus: "var(--semanticFocus)",
};

const MotionModalContent = motion(ModalContent);


const formatAddress = (address: string) => {
  return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
};


const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? "🔴 Data inválida" : format(date, "dd/MM/yyyy HH:mm:ss");
};

const getCountryName = (countryCode: number) => {
  const countries: Record<number, string> = {
    0: "Desconhecido",
    1: "Brasil",
    2: "Estados Unidos",
    3: "Portugal",
    4: "Espanha",
    5: "Argentina",
    6: "Chile",
    7: "Colômbia",
    8: "México",
    9: "Peru",
    10: "Venezuela",
    11: "Uruguai",
    12: "Paraguai",
    13: "Bolívia",
    14: "Chipre",
    15: "Alemanha",
    16: "Itália",
    17: "França",
    18: "Japão",
    19: "China",
    20: "Austrália",
    21: "Nova Zelândia",
    22: "África do Sul",
    23: "Mongólia",
    24: "Bélgica",
    25: "Holanda",
    26: "Bélgica",
    27: "Polônia",
    28: "Turquia",
    29: "Cuba",
    30: "Cabo Verde",
    31: "Sérvia",
    32: "Grecia",
    33: "Bulgária",
    34: "Romênia",
    35: "Hungria",
    36: "República Tcheca",
    37: "Suíça",
    38: "Noruega",
    39: "Dinamarca",
    40: "Finlândia",
    41: "Israel",
    42: "Arábia Saudita",
    43: "Emirados Árabes Unidos",
    44: "Qatar",
    45: "Bahrain",
    46: "Kuwait",
    47: "Líbano",
    48: "Síria",
    49: "Iraque",
    50: "Aruba",
    51: "Curaçao",
    52: "São Martinho",
    53: "São Vicente e Granadinas",
    54: "Trinidad e Tobago",
    55: "Turquia",
    56: "Ucrânia",
    57: "Vaticano",
    58: "Venezuela",
    59: "Vietnã",
    60: "Zâmbia",
  };
  
  return countries[countryCode] || `País ${countryCode}`;
};

const renderEventDetails = (eventData: Record<string, any>) => {
  return Object.entries(eventData).map(([key, value]) => {
    let displayValue;

    if (key === "country") {
      let countryCode = 0;
      try {
        countryCode = Number(value);
        if (isNaN(countryCode)) countryCode = 0;
      } catch (e) {
        console.error("Erro ao converter código do país:", e);
      }
      displayValue = getCountryName(countryCode);
      console.log("Country field detected:", value, "→", displayValue);
    } else if (key === "timestamp") {
      displayValue = formatTimestamp(value as string);
    } else if (typeof value === "boolean") {
      displayValue = value ? "✅ Sim" : "❌ Não";
    } else if (typeof value === "number") {
      displayValue = (Number(value) / 1e18).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    } else if (typeof value === "string" && value.startsWith("0x")) {
      displayValue = formatAddress(value);
    } else {
      displayValue = value;
    }

    return (
      <Box key={key} display="flex" justifyContent="space-between" w="100%" p={2} borderBottom="1px solid var(--background-light)">
        <Text fontWeight="bold" color="var(--text-primary)">{key}:</Text>
        <Text color="var(--accent)">
          {typeof displayValue === "object" ? JSON.stringify(displayValue, null, 2) : displayValue}
        </Text>

      </Box>
    );
  });
};

export const ModalEventList = ({ isOpen, onClose, title, status = "neutral", event }: ModalNeonProps) => {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.75)" backdropFilter="blur(10px)" />
      <MotionModalContent
        bg="var(--background-dark)"
        borderRadius="lg"
        boxShadow={`0px 0px 25px ${statusColors[status]}`}
        border={`2px solid ${statusColors[status]}`}
        p={4} // 🔥 Reduz o padding interno
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        maxW="500px"
      >

        <ModalHeader color={statusColors[status]} textShadow={`0px 0px 15px ${statusColors[status]}`}>
          {title}
        </ModalHeader>
        <ModalCloseButton color="var(--text-primary)" />
        <ModalBody p={0}>
          <VStack spacing={3} align="stretch">
            {renderEventDetails(event)}
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};
