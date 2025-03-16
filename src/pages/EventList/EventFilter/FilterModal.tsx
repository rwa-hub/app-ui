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
    Button,
  } from "@chakra-ui/react";
  
  interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    setUserAddress: (address: string) => void;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
  }
  
  export const FilterModal = ({ isOpen, onClose, setUserAddress, setStartDate, setEndDate }: FilterModalProps) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(8px)" />
        <ModalContent bg="var(--background-dark)" borderRadius="lg" p={6} boxShadow="0px 0px 15px var(--accent)">
          <ModalHeader color="var(--accent)">🔍 Filtros Avançados</ModalHeader>
          <ModalCloseButton color="white" />
  
          <ModalBody>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel color="white">Endereço Ethereum</FormLabel>
                <Input placeholder="0x..." onChange={(e) => setUserAddress(e.target.value)} />
              </FormControl>
  
              <FormControl>
                <FormLabel color="white">Data Inicial</FormLabel>
                <Input type="date" onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
  
              <FormControl>
                <FormLabel color="white">Data Final</FormLabel>
                <Input type="date" onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
  
              <Button colorScheme="teal" w="full" onClick={onClose}>
                Aplicar Filtros
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  