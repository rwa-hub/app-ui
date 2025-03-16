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


const renderEventDetails = (eventData: Record<string, any>) => {
  return Object.entries(eventData).map(([key, value]) => {
    let displayValue;

    if (key === "timestamp") {
      displayValue = formatTimestamp(value as string);
    } else if (typeof value === "boolean") {
      displayValue = value ? "✅ Sim" : "❌ Não";
    } else if (typeof value === "number") {
      displayValue = value.toLocaleString();
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
        p={6}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        maxW="500px"
      >
        <ModalHeader color={statusColors[status]} textShadow={`0px 0px 15px ${statusColors[status]}`}>
          {title}
        </ModalHeader>
        <ModalCloseButton color="var(--text-primary)" />
        <ModalBody>
          <VStack spacing={3} align="stretch">
            {renderEventDetails(event)}
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};
