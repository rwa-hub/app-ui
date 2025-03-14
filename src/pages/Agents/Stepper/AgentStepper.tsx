import { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";

import IDENTITY_REGISTRY_ABI from "@/utils/abis/IdentityRegistry.json";

// 🚀 Passos do Stepper (Mensagens Melhoradas)
const steps = [
  { title: "Conectar Wallet", description: "Faça login com sua carteira Web3 para iniciar o processo." },
  { title: "Aprovar Transação", description: "A Metamask será aberta, aprove a transação." },
  { title: "Aguardando Confirmação", description: "Aguarde a transação ser confirmada na blockchain." },
  { title: "Finalizado", description: "O agente foi adicionado com sucesso!" },
];

// 🔹 Animação para o Stepper
const MotionBox = motion(Box);

export const AgentsStepper = () => {
    
  const { activeStep, setActiveStep } = useSteps({ index: 0, count: steps.length });
  const toast = useToast();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient(); // 🔥 Acesso direto ao RPC
  const [agentAddress, setAgentAddress] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  // 🚀 Função para chamar o contrato (addAgent)
  const { writeContractAsync, isPending } = useWriteContract();

  const handleAddAgent = async () => {
    try {
  
      setActiveStep(2);

      const result = await writeContractAsync({
        address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: "addAgent",
        args: [agentAddress],
      });

      if (!result) {
        throw new Error("Erro ao enviar transação: Hash indefinido.");
      }

      setTxHash(result); 
      setActiveStep(3);

      toast({
        title: "🚀 Transação enviada!",
        description: `Aguardando confirmação na blockchain...`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });

      // 🔥 Checar manualmente a confirmação da transação
      const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });

      if (receipt?.status === "success") {
        setActiveStep(4); 
        toast({
          title: "✅ Agente Adicionado!",
          description: `O endereço ${agentAddress} foi adicionado com sucesso.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("A transação falhou.");
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar agente:", error);
      toast({
        title: "❌ Erro ao adicionar agente",
        description: (error as any)?.message || "Houve um erro ao enviar a transação.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setActiveStep(1); // Volta para o passo anterior caso falhe
    }
  };

  return (
    <MotionBox
      maxW="650px"
      mx="auto"
      p={8}
      borderRadius="lg"
      boxShadow="0px 0px 25px var(--accent)"
      bg="linear-gradient(145deg, rgba(10, 12, 50, 0.9), rgba(18, 22, 75, 0.95))"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <VStack spacing={8} align="stretch">
        {/* 🔹 Barra de progresso futurista */}
        <Progress
          value={(activeStep / (steps.length - 1)) * 100}
          size="sm"
          borderRadius="full"
          bg="var(--textQuinary)"
          sx={{
            "& > div": {
              background: "linear-gradient(90deg, var(--semanticFocus), var(--semanticSuccess))",
              boxShadow: "0px 0px 12px var(--semanticFocus)",
            },
          }}
        />

        {/* 🔹 Stepper alinhado corretamente */}
        <Stepper size="lg" index={activeStep} colorScheme="blue" orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index} _complete={{}}>   
              <Flex align="flex-start" gap={4}>
                {/* 🔵 Ícone/Número alinhado corretamente */}
                <StepIndicator
                  borderWidth="2px"
                  borderColor={activeStep >= index ? "var(--semanticFocus)" : "var(--semanticNeutral)"}
                  bg={activeStep === index ? "var(--semanticFocusShadow)" : "transparent"}
                  color={activeStep >= index ? "white" : "var(--semanticNeutral)"}
                  boxShadow={activeStep >= index ? "0px 0px 15px var(--semanticFocus)" : "none"}
                  transition="all 0.3s ease"
                  flexShrink={0}
                >
                  <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                </StepIndicator>

                {/* 🔹 Textos alinhados corretamente */}
                <VStack align="start" spacing={1}>
                  <StepTitle color="var(--textLink)" fontSize="xl" fontWeight="bold">
                    {step.title}
                  </StepTitle>
                  <StepDescription color="var(--textTertiary)" fontSize="md">
                    {step.description}
                  </StepDescription>
                </VStack>
              </Flex>

              {/* 🔹 Separador ajustado para não sobrepor o texto */}
              {index < steps.length - 1 && <StepSeparator borderColor="var(--semanticNeutral)" />}
            </Step>
          ))}
        </Stepper>

        {/* 🔹 Passo 1: Conectar Wallet */}
        {activeStep === 0 && (
          <Button
            onClick={() => setActiveStep(1)}
            isDisabled={!isConnected}
            bg="var(--buttonPrimary)"
            color="var(--buttonSolidText)"
            _hover={{ bg: "var(--buttonPrimary__02)", transform: "scale(1.05)" }}
          >
            🔗 Conectar Wallet
          </Button>
        )}

        {/* 🔹 Passo 2: Inserir endereço do agente */}
        {activeStep === 1 && (
          <VStack spacing={4}>
            <Input
              placeholder="Endereço do Agente (0x...)"
              value={agentAddress}
              onChange={(e) => setAgentAddress(e.target.value)}
              borderColor="var(--semanticFocus)"
              focusBorderColor="var(--semanticSuccess)"
              boxShadow="0px 0px 10px var(--semanticFocus)"
            />
            <Button
              onClick={handleAddAgent}
              isLoading={isPending}
              isDisabled={!isConnected || agentAddress.length === 0}
              bg="var(--buttonPrimary)"
              color="var(--buttonSolidText)"
              _hover={{ bg: "var(--buttonPrimary__02)", transform: "scale(1.05)" }}
            >
              ➕ Adicionar Agente
            </Button>
          </VStack>
        )}
      </VStack>
    </MotionBox>
  );
};
