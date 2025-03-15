import { Box, Text, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ModalEventList } from "./ModalEventList";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";
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
const formatEventDetails = (event: EventData) => ({
  title: `📌 ${event.eventType}`,
  status: "neutral" as keyof typeof statusIcons,
  event,
});

export const EventItem = ({ event }: EventItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  if (!event || Object.keys(event).length === 0) {
    console.warn("⚠️ Evento indefinido ou vazio, ignorando.");
    return null;
  }

  const { title, status } = formatEventDetails(event);
  const { icon, color } = statusIcons[status];

  return (
    <>
      <MotionBox
        p={4}
        w="95%"
        bg="var(--background-medium-opacity-2)"
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
            <Text fontSize="sm" color="var(--text-primary)">
              {event.timestamp && !isNaN(new Date(event.timestamp).getTime()) 
                ? format(new Date(event.timestamp), "dd/MM/yyyy HH:mm:ss") 
                : "🔴 Data inválida"}
            </Text>
          </Box>
        </HStack>
      </MotionBox>

      <ModalEventList isOpen={isOpen} onClose={onClose} title={title} status={status} event={event} />
    </>
  );
};
