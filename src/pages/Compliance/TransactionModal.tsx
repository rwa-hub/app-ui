import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Button,
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  
  interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedFunctionLabel: string; 
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
    functionInputs: { name: string; type: string; label: string }[];
    handleTransaction: () => void;
  }
  
  const MotionModalContent = motion(ModalContent);
  
  export const TransactionModal = ({
    isOpen,
    onClose,
    selectedFunctionLabel,
    formData,
    setFormData,
    functionInputs,
    handleTransaction,
  }: TransactionModalProps) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(8px)" />
  
        <MotionModalContent
          maxW="500px"
          bg="var(--background-dark)"
          borderRadius="lg"
          p={6}
          border="2px solid var(--select-active-secondary)"
          boxShadow="0px 0px 15px var(--select-active-secondary)"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ModalHeader
            color="var(--select-active-secondary)"
            fontSize="xl"
            textShadow="0px 0px 12px var(--select-active-secondary)"
            fontWeight="bold"
          >
            🚀 {selectedFunctionLabel} 
          </ModalHeader>
          <ModalCloseButton color="var(--text-primary)" />
  
          <ModalBody>
            <VStack spacing={5}>
              {functionInputs.map((input) => (
                <FormControl key={input.name}>
                  <FormLabel
                    color="var(--select-active)"
                    fontSize="sm"
                    fontWeight="bold"
                    marginBottom={2}
                    textTransform="uppercase"
                    textShadow="0px 0px 10px var(--select-active)"
                  >
                    {input.label}
                  </FormLabel>
                  {input.type === "bool" ? (
                    <Switch
                      isChecked={Boolean(formData[input.name])}
                      onChange={(e) => setFormData({ ...formData, [input.name]: e.target.checked })}
                      size="lg"
                      borderRadius="full"
                      colorScheme="pink"
                      boxShadow="0px 0px 10px var(--select-active-secondary)"
                    />
                  ) : (
                    <Input
                      placeholder={input.label}
                      value={formData[input.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
                      bg="var(--background-dark)"
                      color="var(--text-primary)"
                      border="2px solid var(--select-inactive)"
                      _hover={{ borderColor: "var(--select-active)" }}
                      _focus={{
                        borderColor: "var(--select-active-secondary)",
                        boxShadow: "0px 0px 12px var(--select-active-secondary)",
                      }}
                    />
                  )}
                </FormControl>
              ))}
  
              <Button
                onClick={handleTransaction}
                colorScheme="pink"
                size="lg"
                fontWeight="bold"
                borderRadius="lg"
                transition="all 0.3s ease-in-out"
                _hover={{
                  boxShadow: "0px 0px 20px var(--select-active-secondary)",
                  transform: "scale(1.05)",
                }}
              >
                ✅ Confirmar Transação
              </Button>
            </VStack>
          </ModalBody>
        </MotionModalContent>
      </Modal>
    );
  };
  