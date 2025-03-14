import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Button, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface ModalNeonProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    status?: "success" | "error" | "warning" | "neutral" | "focus";
}

const statusColors = {
    success: "var(--semanticSuccess)",
    error: "var(--semanticError)",
    warning: "var(--semanticWarning)",
    neutral: "var(--semanticNeutral)",
    focus: "var(--semanticFocus)",
};

// Motion para efeitos suaves
const MotionModalContent = motion(ModalContent);

export const ModalNeon = ({ isOpen, onClose, title, description, status = "neutral" }: ModalNeonProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="rgba(0, 0, 0, 0.75)" backdropFilter="blur(10px)" />

            <MotionModalContent
              
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

                <ModalBody>
                    <Text color="var(--text-secondary)" textAlign="center">{description}</Text>
                    <VStack spacing={4} mt={4}>
                        <Button
                            w="full"
                            bg={statusColors[status]}
                            color="var(--background-dark)"
                            boxShadow={`0px 0px 15px ${statusColors[status]}`}
                            _hover={{ transform: "scale(1.05)" }}
                            transition="0.3s"
                            onClick={onClose}
                        >
                            Fechar
                        </Button>
                    </VStack>
                </ModalBody>
            </MotionModalContent>
        </Modal>
    );
};
