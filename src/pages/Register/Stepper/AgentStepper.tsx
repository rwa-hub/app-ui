import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface AgentsStepperProps {
  selectedContract: {
    name: string;
    address: `0x${string}`;
    abi: any;
  } | null;
  agentAddress: string;
  activeStep: number;
}

// 🚀 Passos do Stepper (Mensagens Melhoradas)
const steps = [
  { title: "Conectar Wallet", description: "Faça login com sua carteira Web3 para iniciar o processo." },
  { title: "Aprovar Transação", description: "A Metamask será aberta, aprove a transação." },
  { title: "Aguardando Confirmação", description: "Aguarde a transação ser confirmada na blockchain." },
  { title: "Finalizado", description: "O agente foi adicionado com sucesso!" },
];

// 🔹 Animação para o Stepper
const MotionBox = motion(Box);

export const AgentsStepper = ({ selectedContract, agentAddress, activeStep }: AgentsStepperProps) => {
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

        {/* 🔹 Stepper */}
        <Stepper size="lg" index={activeStep} colorScheme="blue" orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <Flex align="flex-start" gap={4}>
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
                <VStack align="start" spacing={1}>
                  <StepTitle color="var(--textLink)" fontSize="xl" fontWeight="bold">
                    {step.title}
                  </StepTitle>
                  <StepDescription color="var(--textTertiary)" fontSize="md">
                    {step.description}
                  </StepDescription>
                </VStack>
              </Flex>
              {index < steps.length - 1 && <StepSeparator borderColor="var(--semanticNeutral)" />}
            </Step>
          ))}
        </Stepper>
      </VStack>
    </MotionBox>
  );
};
