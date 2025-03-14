import { Box, Text, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ModalEventList } from "./ModalEventList";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiClock } from "react-icons/fi";
import { EventData } from "@/store/event-types";
import { format } from "date-fns";

const MotionBox = motion(Box);

interface EventItemProps {
  event: EventData;
}

// 🔹 Ícones por status genérico
const statusIcons = {
  success: { icon: FiCheckCircle, color: "var(--semanticSuccess)" },
  error: { icon: FiXCircle, color: "var(--semanticError)" },
  warning: { icon: FiAlertTriangle, color: "var(--semanticWarning)" },
  neutral: { icon: FiInfo, color: "var(--semanticNeutral)" },
};

// 🔹 Formatar evento dinamicamente
const formatEventDetails = (event: EventData) => {
  return {
    title: `📌 ${event.eventType || "Evento indefinido"}`,
    description: Object.entries(event)
      .filter(([key, value]) => 
        value !== undefined && 
        !["_id", "eventType", "timestamp", "contractAddress", "transactionHash", "blockNumber"].includes(key)
      )
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ") || "📭 Evento sem informações",
    status: "neutral" as keyof typeof statusIcons,
  };
};

export const EventItem = ({ event }: EventItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { title, description, status } = formatEventDetails(event);
  const { icon, color } = statusIcons[status];

  // 🕒 Verificar se o timestamp é válido
  let formattedDate = "⏳ Aguardando confirmação...";
  if (event.timestamp) {
    const parsedDate = new Date(event.timestamp);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = format(parsedDate, "dd/MM/yyyy HH:mm:ss");
    }
  }

  return (
    <>
      <MotionBox
        p={4}
        w="95%"
        bg="var(--background-medium-opacity)"
        alignSelf="center"
        borderRadius="lg"
        opacity={0.8}
        boxShadow={`0px 0px 10px ${color}`}
        border={`2px solid ${color}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        cursor="pointer"
        onClick={onOpen}
      >
        <HStack spacing={3}>
          <Icon as={icon} boxSize={6} color={color} />
          <Box>
            <Text fontSize="lg" fontWeight="bold" color={color}>
              {title}
            </Text>
            <Text fontSize="sm" color="var(--text-secondary)">
              {formattedDate}
            </Text>
            <Text fontSize="sm" color="var(--text-secondary)">
              {description}
            </Text>
          </Box>
        </HStack>
      </MotionBox>

      <ModalEventList isOpen={isOpen} onClose={onClose} title={title} status={status}>
        <Text fontSize="md" color="var(--text-secondary)">
          {description}
        </Text>
      </ModalEventList>
    </>
  );
};
