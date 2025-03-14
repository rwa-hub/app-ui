import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface ModalNeonProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  status?: "success" | "error" | "warning" | "neutral" | "focus";
  children: React.ReactNode;
}

const statusColors = {
  success: "var(--semanticSuccess)",
  error: "var(--semanticError)",
  warning: "var(--semanticWarning)",
  neutral: "var(--semanticNeutral)",
  focus: "var(--semanticFocus)",
};

const MotionModalContent = motion(ModalContent);

export const ModalEventList = ({ isOpen, onClose, title, status = "neutral", children }: ModalNeonProps) => {
  console.log("Modal aberto?", isOpen); 

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
      >
        <ModalHeader color={statusColors[status]} textShadow={`0px 0px 15px ${statusColors[status]}`}>
          {title}
        </ModalHeader>
        <ModalCloseButton color="var(--text-primary)" />
        <ModalBody>{children}</ModalBody>
      </MotionModalContent>
    </Modal>
  );
};
