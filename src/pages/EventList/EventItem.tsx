import { Box, Text, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ModalEventList } from "./ModalEventList";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const MotionBox = motion(Box);

interface EventItemProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    status: "success" | "error" | "warning" | "neutral" | "focus";
  };
}

const statusIcons = {
  success: { icon: FiCheckCircle, color: "var(--semanticSuccess)" },
  error: { icon: FiXCircle, color: "var(--semanticError)" },
  warning: { icon: FiAlertTriangle, color: "var(--semanticWarning)" },
  neutral: { icon: FiInfo, color: "var(--semanticNeutral)" },
  focus: { icon: FiInfo, color: "var(--semanticFocus)" },
};

export const EventItem = ({ event }: EventItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { icon, color } = statusIcons[event.status];

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
              {event.title}
            </Text>
            <Text fontSize="sm" color="var(--text-secondary)">
              {event.date}
            </Text>
          </Box>
        </HStack>
      </MotionBox>

      {/* 🔹 Modal de Detalhes */}
      <ModalEventList isOpen={isOpen} onClose={onClose} title={event.title} status={event.status}>
        <Text fontSize="md" color="var(--text-secondary)">
          {event.description}
        </Text>
      </ModalEventList>
    </>
  );
};
