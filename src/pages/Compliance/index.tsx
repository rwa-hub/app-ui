import { useState } from "react";
import {
  Box,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useWriteContract, usePublicClient } from "wagmi";
import { ComplianceStepper } from "./Stepper/ComplianceStepper";
import { TransactionModal } from "./TransactionModal";
import { CheckCircle, XCircle } from "lucide-react";
import { toast as sonnerToast } from "sonner";

import IDENTITY_REGISTRY_ABI from "@/utils/abis/IdentityRegistry.json";
import MODULAR_COMPLIANCE_ABI from "@/utils/abis/modular_compliance.json";
import FINANCIAL_RWA_ABI from "@/utils/abis/financial_rwa.abi.json";

import { extractWriteFunctionsFromABI, functionInputs, generateInputsFromABI } from "@/utils/function-inputs";

const contracts = {
  kyc: {
    name: "Identity Registry (KYC)",
    address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
    abi: IDENTITY_REGISTRY_ABI,
    functions: extractWriteFunctionsFromABI(IDENTITY_REGISTRY_ABI),
  },
  modularCompliance: {
    name: "Modular Compliance",
    address: import.meta.env.VITE_MODULAR_COMPLIANCE_ADDRESS as `0x${string}`,
    abi: MODULAR_COMPLIANCE_ABI,
    functions: extractWriteFunctionsFromABI(MODULAR_COMPLIANCE_ABI),
  },
  financialRWA: {
    name: "Financial RWA",
    address: import.meta.env.VITE_FINANCIAL_RWA_ADDRESS as `0x${string}`,
    abi: FINANCIAL_RWA_ABI,
    functions: extractWriteFunctionsFromABI(FINANCIAL_RWA_ABI),
  },
};

export const Compliance = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const [selectedTab, setSelectedTab] = useState<"kyc" | "modularCompliance" | "financialRWA">("kyc");
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const selectedContract = contracts[selectedTab];

  const handleTabChange = (index: number) => {
    const tabKeys = ["kyc", "modularCompliance", "financialRWA"] as const;
    setSelectedTab(tabKeys[index]);
    setSelectedFunction("");
  };


  const handleTransaction = async () => {
    if (!selectedFunction) {
      sonnerToast("⚠️ Selecione uma função.", { position: "top-center", duration: 3000 });
      return;
    }

    setModalOpen(false);

    let result;
    try {
      setActiveStep(2);

      const args = functionInputs[selectedFunction as keyof typeof functionInputs]?.inputs.map((input) => {
        const value = formData[input.name];

        if (input.type === "uint256" || input.type === "int256") {
          return BigInt(value) * BigInt(10 ** 18)
        }

        return value;
      }) || [];

      result = await writeContractAsync({
        address: selectedContract.address,
        abi: selectedContract.abi,
        functionName: selectedFunction,
        args,
      });

      if (!result) throw new Error("Erro ao enviar transação.");

      setActiveStep(3);
      const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });

      if (receipt?.status === "success") {
        setActiveStep(4);
        sonnerToast.success(
          <Box textAlign="center">
            <CheckCircle size={32} color="#00ffcc" />
            <strong>Transação Confirmada</strong>
            <p>Função {selectedFunction} executada com sucesso! 🚀</p>
          </Box>,
          { position: "top-center", duration: 5000 }
        );
      } else {
        throw new Error("A transação falhou.");
      }
    } catch (error) {
      const receipt = result
        ? await publicClient?.getTransactionReceipt({ hash: result })
        : null;

      const safeReceipt = receipt
        ? JSON.stringify(receipt, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
        : "Sem dados de recibo.";

      sonnerToast.error(
        <Box
          textAlign="center"
          maxW="500px"
          maxH="250px"
          overflowY="auto"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          <XCircle size={32} color="#ff2a6d" />
          <strong>Erro na Transação</strong>
          <pre style={{ textAlign: "left", fontSize: "12px", overflowWrap: "break-word" }}>
            {(safeReceipt as any)?.message?.slice(0, 400)}
          </pre>
        </Box>,
        { position: "top-center", duration: 8000 }
      );

      setActiveStep(1);
    }
  };

  return (
    <Box>
      {/* 🔹 Tabs do Sistema */}
      <Tabs isFitted variant="soft-rounded" colorScheme="blue" onChange={handleTabChange}>
        <TabList mb={4}>
          <Tab>🔐 KYC (Identity Registry)</Tab>
          <Tab>🏛 Modular Compliance</Tab>
          <Tab>💰 Financial RWA</Tab>
        </TabList>

        <TabPanels>
          {/* 🔹 Aba KYC */}
          <TabPanel>
            <Box
              bg="var(--background-medium-opacity-1)"
              p={5}
              borderRadius="lg"
              textAlign="center"
              color="white"
              w="100%"
            >
              <Text fontSize="2xl" textAlign="left" fontWeight="bold" color="#00ffcc">
                Identidade Digital e Compliance (ERC-3643)
              </Text>
              <Text textAlign="left" fontSize="md" color="gray.300" mt={2}>
                O <em style={{
                  color: "#00ffcc",
                }}> KYC (Identity Registry) </em> é um componente do <em style={{
                  color: "#00ffcc",
                }}> ERC-3643 </em> que armazena identidades verificadas
                <em style={{
                  color: "#00ffcc",
                }}> on-chain </em>. Ele garante que apenas usuários aprovados possam possuir ou transferir ativos tokenizados.
                A verificação é feita por agentes confiáveis.
              </Text>
            </Box>

            {/* 🔹 Formulário de Seleção */}
            <VStack spacing={4} mt={6}>
              <Select
                placeholder="Selecione uma função"
                value={selectedFunction}
                onChange={(e) => {
                  setSelectedFunction(e.target.value);
                  setModalOpen(true);
                }}
              >
                {contracts.kyc.functions.map((func: string) => (
                  <option key={func} value={func}>
                    {functionInputs[func as keyof typeof functionInputs]?.label || func}
                  </option>
                ))}
              </Select>
            </VStack>
          </TabPanel>

          {/* 🔹  Modular Compliance */}
          <TabPanel>
            <Box
              bg="var(--background-medium-opacity-1)"
              p={5}
              borderRadius="lg"
              textAlign="center"
              color="white"
              w="100%"
            >
              <Text fontSize="2xl" textAlign="left" fontWeight="bold" color="#00ffcc">
                 Modular Compliance
              </Text>
              <Text textAlign="left" fontSize="md" color="gray.300" mt={2}>
                O <em style={{
                  color: "#00ffcc",
                }}> Modular Compliance </em> permite personalizar regras de compliance para ativos tokenizados.
                Desenvolvido em Solidity, ele possibilita adicionar ou remover regras de aceitação e transferência
                de forma modular, garantindo flexibilidade e <em style={{
                  color: "#00ffcc",
                }}> conformidade regulatória </em>.
              </Text>
            </Box>

            {/* Select Form */}
            <VStack spacing={4} mt={6}>
              <Select
                placeholder="Selecione uma função"
                value={selectedFunction}
                onChange={(e) => {
                  setSelectedFunction(e.target.value);
                  setModalOpen(true);
                }}
              >
                {contracts.modularCompliance.functions.map((func: string) => (
                  <option key={func} value={func}>
                    {functionInputs[func as keyof typeof functionInputs]?.label || func}
                  </option>
                ))}
              </Select>
            </VStack>
          </TabPanel>

          {/*  Financial RWA */}
          <TabPanel>
            <Box
              bg="var(--background-medium-opacity-1)"
              p={5}
              borderRadius="lg"
              textAlign="center"
              color="white"
              w="100%"
            >
              <Text fontSize="2xl" textAlign="left" fontWeight="bold" color="#00ffcc">
                Módulo Financeiro para RWA
              </Text>
              <Text textAlign="left" fontSize="md" color="gray.300" mt={2}>
                O <em style={{
                  color: "#00ffcc",
                }}> Financial RWA  </em> é um módulo customizado em Solidity para gerenciar critérios financeiros
                antes da transferência de ativos <em style={{
                  color: "#00ffcc",
                }}> RWA (Real World Assets) </em>. Ele verifica requisitos como <em style={{
                  color: "#00ffcc",
                }}> renda mínima, </em>
                <em style={{
                  color: "#00ffcc",
                }}> documentos aprovados e seguro de crédito </em>, garantindo a conformidade da transação.
              </Text>
            </Box>

            {/*   Select Form */}
            <VStack spacing={4} mt={6}>
              <Select
                placeholder="Selecione uma função"
                value={selectedFunction}
                onChange={(e) => {
                  setSelectedFunction(e.target.value);
                  setModalOpen(true);
                }}
              >
                {contracts.financialRWA.functions.map((func: string) => (
                  <option key={func} value={func}>
                    {functionInputs[func as keyof typeof functionInputs]?.label || func}
                  </option>
                ))}
              </Select>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedFunctionLabel={functionInputs[selectedFunction as keyof typeof functionInputs]?.label || selectedFunction}
        formData={formData}
        setFormData={setFormData}
        functionInputs={
          functionInputs[selectedFunction as keyof typeof functionInputs]?.inputs ||
          generateInputsFromABI(selectedContract.abi, selectedFunction)
        }
        handleTransaction={handleTransaction}
      />

      <ComplianceStepper activeStep={activeStep} selectedContract={selectedContract} selectedFunction={selectedFunction} />
    </Box>
  );
};
