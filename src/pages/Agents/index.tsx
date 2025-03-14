import { useState } from "react";
import { AgentsStepper } from "./Stepper/AgentStepper";
import { Box, Select, Input, Button, useToast, VStack } from "@chakra-ui/react";
import { useWriteContract, usePublicClient } from "wagmi";

import IDENTITY_REGISTRY_ABI from "@/utils/abis/IdentityRegistry.json";
import IDENTITY_REGISTRY_STORAGE_ABI from "@/utils/abis/IdentityRegistryStorage.json";
import TOKEN_RWA_ABI from "@/utils/abis/token.json";

// 🔥 Lista de contratos
const contracts = [
  {
    name: "Identity Registry",
    address: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
    abi: IDENTITY_REGISTRY_ABI,
  },
  {
    name: "Identity Registry Storage",
    address: import.meta.env.VITE_IDENTITY_REGISTRY_STORAGE_ADDRESS as `0x${string}`,
    abi: IDENTITY_REGISTRY_STORAGE_ABI,
  },
  {
    name: "Token RWA",
    address: import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`,
    abi: TOKEN_RWA_ABI,
  },
];

export const Agents = () => {
  const toast = useToast();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [selectedContract, setSelectedContract] = useState(contracts[0]);
  const [agentAddress, setAgentAddress] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const handleAddAgent = async () => {
    if (!selectedContract) {
      toast({ title: "⚠️ Nenhum contrato selecionado.", status: "warning" });
      return;
    }

    try {
      setActiveStep(2);

      const result = await writeContractAsync({
        address: selectedContract.address,
        abi: selectedContract.abi,
        functionName: "addAgent",
        args: [agentAddress],
      });

      if (!result) {
        throw new Error("Erro ao enviar transação: Hash indefinido.");
      }

      setActiveStep(3);

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
      setActiveStep(1);
    }
  };

  return (
    <Box>
      <VStack spacing={4} mb={4}>
        {/* 🔹 Selecionar contrato */}
        <Select
          placeholder="Selecione um contrato"
          value={selectedContract?.address || ""}
          onChange={(e) => setSelectedContract(contracts.find((c) => c.address === e.target.value) || contracts[0])}
        >
          {contracts.map(({ name, address }) => (
            <option key={address} value={address}>
              {name} ({address.slice(0, 6)}...{address.slice(-4)})
            </option>
          ))}
        </Select>

        {/* 🔹 Inserir endereço */}
        <Input placeholder="Endereço do Agente (0x...)" value={agentAddress} onChange={(e) => setAgentAddress(e.target.value)} />

        <Button
          onClick={handleAddAgent}
          isLoading={isPending}
          isDisabled={!selectedContract || !agentAddress}
        >
          ➕ Adicionar Agente
        </Button>
      </VStack>

      {/* 🔹 Passa os dados para o Stepper */}
      <AgentsStepper selectedContract={selectedContract} agentAddress={agentAddress} activeStep={activeStep} />
    </Box>
  );
};
