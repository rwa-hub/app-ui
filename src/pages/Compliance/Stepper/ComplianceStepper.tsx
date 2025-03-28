import {
  Box,
  HStack,
  Text,
  Flex,
  Progress,
  Circle,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface ComplianceStepperProps {
  selectedContract: {
    name: string;
    address: `0x${string}`;
    abi: any;
  } | null;
  selectedFunction: string;
  activeStep: number;
}

// 🚀 Definição dos passos dinâmicos
const getSteps = (selectedFunction: string) => [
  { title: "Conectar Wallet", description: "Faça login com sua carteira Web3 para iniciar o processo." },
  { title: `Aprovar ${selectedFunction}`, description: "A Metamask será aberta, aprove a transação." },
  { title: "Aguardando Confirmação", description: "Aguarde a transação ser confirmada na blockchain." },
  { title: "Finalizado", description: `Ação '${selectedFunction}' executada com sucesso!` },
];

// 🔹 Animação para o Stepper
const MotionBox = motion(Box);
const MotionCircle = motion(Circle);

export const ComplianceStepper = ({ selectedContract, selectedFunction, activeStep }: ComplianceStepperProps) => {
  const steps = getSteps(selectedFunction);

  return (
    <MotionBox
      mx="auto"
      w="90%"
      p={6}
      borderRadius="lg"
      boxShadow="0px 0px 25px var(--accent)"
      bg="linear-gradient(145deg, rgba(10, 12, 50, 0.9), rgba(18, 22, 75, 0.95))"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      display="flex"
      flexDirection="column"
      height="auto"
    >
      {/* 🔹 Exibir detalhes do contrato e função selecionada */}
      {selectedContract && (
        <Box textAlign="center" mb={6}>
          <Text fontSize="lg" fontWeight="bold" color="var(--textLink)">
            {selectedContract.name}
          </Text>
          <Text fontSize="sm" color="var(--textTertiary)">
            {selectedFunction}
          </Text>
        </Box>
      )}

      {/* 🔹 Stepper Minimalista Neon */}
      <Box position="relative" py={8}>
        {/* Linha de base */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          right="0"
          height="2px"
          bg="rgba(255,255,255,0.1)"
          transform="translateY(-50%)"
          zIndex={1}
        />

        {/* Linha de progresso neon */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          width={`${(activeStep / (steps.length - 1)) * 100}%`}
          height="2px"
          bg="linear-gradient(90deg, var(--semanticFocus), var(--semanticSuccess))"
          boxShadow="0px 0px 12px var(--semanticFocus)"
          transform="translateY(-50%)"
          transition="width 0.5s ease"
          zIndex={2}
        />

        {/* Pontos do Stepper */}
        <Flex justify="space-between" position="relative" zIndex={3}>
          {steps.map((step, index) => (
            <Tooltip 
              key={index} 
              label={`${step.title}: ${step.description}`} 
              placement="top"
              hasArrow
              bg="rgba(10, 12, 50, 0.95)"
              color="white"
              borderRadius="md"
              boxShadow="0px 0px 10px var(--semanticFocus)"
            >
              <Box textAlign="center">
                <MotionCircle
                  size="14px"
                  bg={activeStep >= index 
                    ? "var(--semanticFocus)" 
                    : "rgba(255,255,255,0.1)"}
                  boxShadow={activeStep >= index 
                    ? "0px 0px 15px var(--semanticFocus)" 
                    : "none"}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                  mb={2}
                />
                <Text 
                  fontSize="xs" 
                  fontWeight={activeStep === index ? "bold" : "normal"}
                  color={activeStep >= index 
                    ? "var(--textLink)" 
                    : "var(--textTertiary)"}
                  opacity={activeStep === index ? 1 : 0.7}
                  textShadow={activeStep === index 
                    ? "0px 0px 8px var(--semanticFocus)" 
                    : "none"}
                  maxW="80px"
                  textAlign="center"
                  display={["none", "none", "block"]}
                >
                  {step.title}
                </Text>
              </Box>
            </Tooltip>
          ))}
        </Flex>
      </Box>

      {/* 🔹 Exibir passo atual */}
      <Box 
        textAlign="center" 
        mt={4} 
        p={4} 
        borderRadius="md" 
        bg="rgba(255,255,255,0.05)"
        boxShadow="inset 0px 0px 10px rgba(0,0,0,0.2)"
      >
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color="var(--textLink)"
          textShadow="0px 0px 8px var(--semanticFocus)"
        >
          {steps[activeStep].title}
        </Text>
        <Text 
          fontSize="md" 
          color="var(--textTertiary)"
          mt={1}
        >
          {steps[activeStep].description}
        </Text>
      </Box>
    </MotionBox>
  );
};