import { useEffect, useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Select,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Switch,
    NumberInput,
    NumberInputField,
    useDisclosure,
    SimpleGrid,
} from "@chakra-ui/react";
import { useWriteContract, usePublicClient } from "wagmi";
import { useEventStore } from "@/store/useEventStore";
import IDENTITY_REGISTRY_ABI from "@/utils/abis/IdentityRegistry.json";
import IDENTITY_REGISTRY_STORAGE_ABI from "@/utils/abis/IdentityRegistryStorage.json";
import TOKEN_RWA_ABI from "@/utils/abis/token.json";
import FINANCIAL_RWA_ABI from "@/utils/abis/financial_rwa.abi.json";


import { NeonLoader } from "@/components/NeonLoader";

import NeonToast from "@/components/NeonToast"; 

import { parseEther } from "viem";

const contracts = {
    IdentityRegistry: {
        address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
        abi: IDENTITY_REGISTRY_ABI,
    },
    IdentityRegistryStorage: {
        address: import.meta.env.VITE_IDENTITY_REGISTRY_STORAGE_ADDRESS as `0x${string}`,
        abi: IDENTITY_REGISTRY_STORAGE_ABI,
    },
    TokenRWA: {
        address: import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`,
        abi: TOKEN_RWA_ABI,
    },
    FinancialRWA: {
        address: import.meta.env.VITE_FINANCIAL_RWA_ADDRESS as `0x${string}`,
        abi: FINANCIAL_RWA_ABI,
    },

};




export const Register = () => {
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const [agentAddress, setAgentAddress] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [isTransactionPending, setTransactionPending] = useState(false);
    

    const [country, setCountry] = useState<number>(0);

    const connectWebSocket = useEventStore((state) => state.connectWebSocket);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [buyerData, setBuyerData] = useState({
        creditInsuranceApproved: false,
        serasaClearance: false,
        documentsVerified: false,
        income: "5",
        addressVerified: "",
        saleRegistered: false,
        signedAgreement: false
    });

    const registerIdentityKycCountry = async () => {
        try {
            setActiveStep(2);
            const result = await writeContractAsync({
                address: contracts.IdentityRegistry.address,
                abi: contracts.IdentityRegistry.abi,
                functionName: "registerIdentity",
                args: [
                    agentAddress,                                                    
                    import.meta.env.VITE_IDENTITY_ADDRESS as `0x${string}`,      
                    country,                                                       
                ],
            });

            if (!result) {
                throw new Error("Erro ao enviar transação: Hash indefinido.");
            }

            setActiveStep(3);
            setTransactionPending(true);

            const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });
            if (receipt?.status === "success") {
                setActiveStep(4);
                setTransactionPending(false);

                NeonToast.success(
                    `✅ KYC registrado com sucesso!\nEndereço: ${agentAddress}`
                );
            } else {
                throw new Error("A transação falhou.");
            }
        } catch (error) {
            console.error("❌ Erro na transação:", error);
            setActiveStep(1);
            setTransactionPending(false);

            NeonToast.error(
                `🚨 Erro ao registrar o KYC.\n${
                    (error as any)?.message || "Houve um erro ao enviar a transação."
                }`
            );
        }
    };

    const aprroveUserToBuyOrSellCompliance = async () => {
        try {
            setActiveStep(2);
            const rendaValue = String(buyerData.income).replace(/\./g, '');
            const rendaWei = parseEther(rendaValue);

            const result = await writeContractAsync({
                address: contracts.FinancialRWA.address,
                abi: contracts.FinancialRWA.abi,
                functionName: "approveBuyer",
                args: [
                    agentAddress,
                    buyerData.creditInsuranceApproved,
                    buyerData.serasaClearance,
                    buyerData.documentsVerified,
                    rendaWei,
                    buyerData.addressVerified,
                    buyerData.saleRegistered,
                    buyerData.signedAgreement
                ],
            });

            if (!result) {
                throw new Error("Erro ao enviar transação: Hash indefinido.");
            }

            setActiveStep(3);
            setTransactionPending(true);

            const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });
            if (receipt?.status === "success") {
                setActiveStep(4);
                setTransactionPending(false);
    
                NeonToast.success(
                    `✅ Comprador aprovado com sucesso!\nEndereço: ${agentAddress}`
                );
            } else {
                throw new Error("A transação falhou.");
            }
    
        } catch (error) {
            console.error("❌ Erro na transação:", error);
            setActiveStep(1);
            setTransactionPending(false);
    
            NeonToast.error(
                `🚨 Erro ao registrar o KYC do usuario.\n${
                    (error as any)?.message || "Houve um erro ao enviar a transação."
                }`
            );
        }
    }



    useEffect(() => {
        connectWebSocket();
    }, []);

    const handleBuyerDataChange = (field: string, value: string | boolean | number) => {
        setBuyerData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApproveUser = () => {
        onClose();
        aprroveUserToBuyOrSellCompliance();
    };

    const openApprovalModal = () => {
        onOpen();
    };

    return (
        <Box w="100%" maxW="1000px" mx="auto">
            {isTransactionPending && <NeonLoader />}

            <Box
                bg="var(--background-medium-opacity-1)"
                p={5}
                borderRadius="lg"
                boxShadow="10px 0 0 2px var(--accent)"
                textAlign="center"
                color="white"
                w="100%"
                mb={10}
            >
                <Text fontFamily="ExoBold" textAlign="left" fontSize="3xl" color="var(--rose)">
                    Registrar um novo usuário (buyer / seller)
                </Text>
                <Text textAlign="left" fontSize="lg" color="gray.300" mt={2}>
                    Processo de registro em duas etapas: 1) Registro KYC e 2) Aprovação do comprador
                </Text>
            </Box>

            <HStack spacing={8} align="stretch">
                {/* Box do KYC */}
                <Box
                    w="100%"
                    p={6}
                    borderRadius="xl"
                    bg="rgba(13, 15, 23, 0.95)"
                    border="1px solid var(--accent)"
                    boxShadow="0 0 20px var(--accent)"
                >
                    <VStack spacing={6} align="stretch">
                        <Box borderBottom="2px solid var(--accent)" pb={4}>
                            <Text fontSize="2xl" fontFamily="ExoBold" color="var(--rose)">
                                📝 Registro KYC
                            </Text>
                            <Text fontSize="md" color="gray.400">
                                Registre o KYC do usuário na blockchain
                            </Text>
                        </Box>

                        <FormControl>
                            <FormLabel
                                color="var(--accent)"
                                fontSize="lg"
                                fontWeight="bold"
                            >
                                👤 Endereço do Usuário
                            </FormLabel>
                            <Input
                                placeholder="0x..."
                                value={agentAddress}
                                onChange={(e) => setAgentAddress(e.target.value)}
                                bg="blackAlpha.500"
                                border="1px solid var(--accent)"
                                _hover={{ borderColor: "var(--rose)" }}
                                _focus={{ borderColor: "var(--rose)", boxShadow: "0 0 10px var(--rose)" }}
                                color="white"
                                fontFamily="monospace"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                color="var(--accent)"
                                fontSize="lg"
                                fontWeight="bold"
                            >
                                🌎 País
                            </FormLabel>
                            <Select
                                value={country}
                                onChange={(e) => setCountry(Number(e.target.value))}
                                bg="blackAlpha.500"
                                border="1px solid var(--accent)"
                                _hover={{ borderColor: "var(--rose)" }}
                                color="white"
                            >
                                <option value={0}>Selecione o país</option>
                                <option value={55}>Brasil</option>
                                <option value={1}>Estados Unidos</option>
                                <option value={351}>Portugal</option>
                                <option value={34}>Espanha</option>
                                <option value={44}>Reino Unido</option>
                            </Select>
                        </FormControl>

                        <Box
                            p={4}
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            border="1px solid var(--accent)"
                        >
                            <HStack spacing={4} align="center">
                                <Box flex={1}>
                                    <Text color="var(--accent)" fontSize="sm">
                                        Status do KYC
                                    </Text>
                                    <Text color="white" fontSize="lg" fontWeight="bold">
                                        {activeStep === 0 && "Aguardando Registro"}
                                        {activeStep === 1 && "Erro no Registro"}
                                        {activeStep === 2 && "Enviando Transação"}
                                        {activeStep === 3 && "Confirmando na Blockchain"}
                                        {activeStep === 4 && "KYC Registrado ✅"}
                                    </Text>
                                </Box>
                                <Box
                                    w="12px"
                                    h="12px"
                                    borderRadius="full"
                                    bg={activeStep === 4 ? "green.500" : activeStep > 0 ? "yellow.500" : "red.500"}
                                    boxShadow={`0 0 10px ${activeStep === 4 ? "#48BB78" : activeStep > 0 ? "#ECC94B" : "#E53E3E"}`}
                                />
                            </HStack>
                        </Box>

                        <Button
                            colorScheme="cyan"
                            size="lg"
                            onClick={registerIdentityKycCountry}
                            isDisabled={!agentAddress || !country || activeStep === 2 || activeStep === 3}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 0 15px var(--accent)"
                            }}
                            transition="all 0.2s"
                            leftIcon={<span>📋</span>}
                        >
                            {activeStep === 4 ? "Registrar Novo KYC" : "Registrar KYC"}
                        </Button>

                        {activeStep === 4 && (
                            <Button
                                colorScheme="purple"
                                size="lg"
                                onClick={openApprovalModal}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 0 15px var(--rose)"
                                }}
                                transition="all 0.2s"
                                leftIcon={<span>✨</span>}
                            >
                                Prosseguir para Aprovação
                            </Button>
                        )}
                    </VStack>
                </Box>
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay 
                    bg="blackAlpha.800"
                    backdropFilter="blur(10px)"
                />
                <ModalContent 
                    bg="rgba(13, 15, 23, 0.95)"
                    border="1px solid var(--accent)"
                    boxShadow="0 0 20px var(--accent)"
                    borderRadius="xl"
                    p={4}
                >
                    <ModalHeader 
                        color="var(--rose)"
                        borderBottom="2px solid var(--accent)"
                        pb={4}
                        fontSize="2xl"
                        fontFamily="ExoBold"
                    >
                        🏦 Aprovar Novo Comprador
                    </ModalHeader>
                    <ModalCloseButton color="var(--accent)" />
                    <ModalBody pb={6}>
                        <VStack spacing={6}>
                            <FormControl>
                                <FormLabel 
                                    color="var(--accent)"
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    📍 Endereço do Comprador
                                </FormLabel>
                                <Input 
                                    value={agentAddress} 
                                    isReadOnly 
                                    bg="blackAlpha.500"
                                    border="1px solid var(--accent)"
                                    _hover={{ borderColor: "var(--rose)" }}
                                    color="white"
                                    fontFamily="monospace"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel 
                                    color="var(--accent)"
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    🏠 Endereço Físico Verificado
                                </FormLabel>
                                <Input
                                    value={buyerData.addressVerified}
                                    onChange={(e) => handleBuyerDataChange('addressVerified', e.target.value)}
                                    placeholder="Digite o endereço completo"
                                    bg="blackAlpha.500"
                                    border="1px solid var(--accent)"
                                    _hover={{ borderColor: "var(--rose)" }}
                                    _focus={{ borderColor: "var(--rose)", boxShadow: "0 0 10px var(--rose)" }}
                                    color="white"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel 
                                    color="var(--accent)"
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    💰 Renda Mensal (R$)
                                </FormLabel>
                                <NumberInput
                                    value={buyerData.income}
                                    onChange={(value) => handleBuyerDataChange('income', value)}
                                    min={5000}
                                    precision={0}
                                    format={(value) => Number(value).toLocaleString('pt-BR')}
                                    parse={(value) => value.replace(/\D/g, '')}
                                >
                                    <NumberInputField
                                        bg="blackAlpha.500"
                                        border="1px solid var(--accent)"
                                        _hover={{ borderColor: "var(--rose)" }}
                                        _focus={{ borderColor: "var(--rose)", boxShadow: "0 0 10px var(--rose)" }}
                                        color="white"
                                        placeholder="Ex: 10.000"
                                    />
                                </NumberInput>
                                <Text 
                                    fontSize="sm" 
                                    color="gray.400" 
                                    mt={1}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <span style={{ color: "var(--rose)", marginRight: "4px" }}>ℹ️</span>
                                    Renda mínima necessária: R$ 5.000
                                </Text>
                            </FormControl>

                            <Box 
                                w="100%" 
                                p={4} 
                                bg="blackAlpha.400" 
                                borderRadius="xl"
                                border="1px solid var(--accent)"
                            >
                                <Text 
                                    color="var(--rose)" 
                                    fontSize="lg" 
                                    fontWeight="bold" 
                                    mb={4}
                                >
                                    ✅ Verificações Necessárias
                                </Text>
                                <SimpleGrid columns={2} spacing={4}>
                                    <FormControl display="flex" alignItems="center" bg="blackAlpha.400" p={3} borderRadius="lg">
                                        <FormLabel color="var(--accent)" mb="0" flex="1">
                                            🛡️ Seguro de Crédito
                                        </FormLabel>
                                        <Switch
                                            isChecked={buyerData.creditInsuranceApproved}
                                            onChange={(e) => handleBuyerDataChange('creditInsuranceApproved', e.target.checked)}
                                            colorScheme="cyan"
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center" bg="blackAlpha.400" p={3} borderRadius="lg">
                                        <FormLabel color="var(--accent)" mb="0" flex="1">
                                            📊 Serasa
                                        </FormLabel>
                                        <Switch
                                            isChecked={buyerData.serasaClearance}
                                            onChange={(e) => handleBuyerDataChange('serasaClearance', e.target.checked)}
                                            colorScheme="cyan"
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center" bg="blackAlpha.400" p={3} borderRadius="lg">
                                        <FormLabel color="var(--accent)" mb="0" flex="1">
                                            📄 Documentos
                                        </FormLabel>
                                        <Switch
                                            isChecked={buyerData.documentsVerified}
                                            onChange={(e) => handleBuyerDataChange('documentsVerified', e.target.checked)}
                                            colorScheme="cyan"
                                        />
                                    </FormControl>

                                    <FormControl display="flex" alignItems="center" bg="blackAlpha.400" p={3} borderRadius="lg">
                                        <FormLabel color="var(--accent)" mb="0" flex="1">
                                            📝 Venda Registrada
                                        </FormLabel>
                                        <Switch
                                            isChecked={buyerData.saleRegistered}
                                            onChange={(e) => handleBuyerDataChange('saleRegistered', e.target.checked)}
                                            colorScheme="cyan"
                                        />
                                    </FormControl>

                                    <FormControl 
                                        display="flex" 
                                        alignItems="center" 
                                        bg="blackAlpha.400" 
                                        p={3} 
                                        borderRadius="lg"
                                        gridColumn="span 2"
                                    >
                                        <FormLabel color="var(--accent)" mb="0" flex="1">
                                            ✍️ Contrato Assinado
                                        </FormLabel>
                                        <Switch
                                            isChecked={buyerData.signedAgreement}
                                            onChange={(e) => handleBuyerDataChange('signedAgreement', e.target.checked)}
                                            colorScheme="cyan"
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            <Button
                                colorScheme="cyan"
                                w="100%"
                                size="lg"
                                onClick={handleApproveUser}
                                isDisabled={!buyerData.addressVerified}
                                _hover={{ 
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 0 15px var(--accent)"
                                }}
                                transition="all 0.2s"
                            >
                                🚀 Aprovar Comprador
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

       
        </Box>
    );
};
