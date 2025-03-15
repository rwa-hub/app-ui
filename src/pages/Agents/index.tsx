import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  Button,
} from "@chakra-ui/react";
import { useWriteContract, usePublicClient } from "wagmi";

import IDENTITY_REGISTRY_ABI from "@/utils/abis/IdentityRegistry.json";
import IDENTITY_REGISTRY_STORAGE_ABI from "@/utils/abis/IdentityRegistryStorage.json";
import TOKEN_RWA_ABI from "@/utils/abis/token.json";
import { AgentsStepper } from "./Stepper/AgentStepper";
import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info } from "lucide-react";

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
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [selectedContract, setSelectedContract] = useState(contracts[0]);
  const [agentAddress, setAgentAddress] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const handleTransaction = async (method: "addAgent" | "removeAgent") => {
    if (!selectedContract) {
      sonnerToast(
        <Box textAlign="center" p={3}>
          <Info size={40} color="#ffd700" />
          <Text fontWeight="bold" color="white" mt={2}>
            Nenhum contrato selecionado
          </Text>
          <Text fontSize="sm" color="gray.300">
            Selecione um contrato antes de continuar.
          </Text>
        </Box>,
        { style: toastStyle }
      );
      return;
    }

    try {
      setActiveStep(2);

      const result = await writeContractAsync({
        address: selectedContract.address,
        abi: selectedContract.abi,
        functionName: method,
        args: [agentAddress],
      });

      if (!result) {
        throw new Error("Erro ao enviar transação: Hash indefinido.");
      }

      setActiveStep(3);

      const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });

      if (receipt?.status === "success") {
        setActiveStep(4);
        sonnerToast.success(
          <Box textAlign="center" p={3}>
            <CheckCircle size={40} color="#00ffcc" />
            <Text fontWeight="bold" color="#00ffcc" mt={2}>
              {method === "addAgent" ? "Agente Adicionado!" : "Agente Removido!"}
            </Text>
            <Text fontSize="sm" color="gray.300">
              O endereço <strong>{agentAddress}</strong> foi {method === "addAgent" ? "adicionado" : "removido"} com sucesso.
            </Text>
          </Box>,
          { style: toastStyle }
        );
      } else {
        throw new Error("A transação falhou.");
      }
    } catch (error) {
      console.error("❌ Erro na transação:", error);
      sonnerToast.error(
        <Box textAlign="center" p={3}>
          <XCircle size={40} color="#ff2a6d" />
          <Text fontWeight="bold" color="#ff2a6d" mt={2}>
            Erro ao {method === "addAgent" ? "adicionar" : "remover"} agente
          </Text>
          <Text fontSize="sm" color="gray.300">
            {(error as any)?.message || "Houve um erro ao enviar a transação."}
          </Text>
        </Box>,
        { style: toastStyle }
      );
      setActiveStep(1);
    }
  };

  const toastStyle = {
    background: "rgba(15, 15, 15, 0.95)",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0, 255, 204, 0.5)",
    border: "1px solid #00ffcc",
    color: "white",
    padding: "15px",
  };

  return (
    <Box w="100%" maxW="1000px" mx="auto">
      {/* 🔹 Box de Explicação */}
      <Box
        bg="blackAlpha.900"
        p={5}
        borderRadius="lg"
        boxShadow="0px 0px 20px rgba(0, 255, 204, 0.8)"
        mb={6}
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" color="#00ffcc">
          🎭 Gerenciamento de Agentes
        </Text>
        <Text fontSize="lg" color="gray.300" mt={2}>
          Agentes são usuários com permissões especiais para interagir com os contratos.
          Aqui você pode adicionar ou remover agentes para controlar o acesso às operações críticas.
        </Text>
      </Box>

      {/* 🔹 Layout Principal */}
      <HStack spacing={8} align="stretch" justify="center">
        {/* 🔹 Box de Inputs */}
        <Box
          p={6}
          borderRadius="lg"
          bg="rgba(0, 255, 204, 0.1)"
          boxShadow="0px 0px 15px #00ffcc"
          w="50%"
          minH="250px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={4} align="stretch">
            {/* 🔥 Seção de Contrato */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="#00ffcc" mb={2}>
                Selecione o Contrato:
              </Text>
              <Select
                placeholder="Selecione um contrato"
                value={selectedContract?.address || ""}
                onChange={(e) => setSelectedContract(contracts.find((c) => c.address === e.target.value) || contracts[0])}
                bg="blackAlpha.800"
                color="white"
                borderColor="cyan.500"
                _hover={{ borderColor: "cyan.300" }}
              >
                {contracts.map(({ name, address }) => (
                  <option key={address} value={address}>
                    {name} ({address.slice(0, 6)}...{address.slice(-4)})
                  </option>
                ))}
              </Select>
            </Box>

            {/* 🔹 Input para endereço do Agente */}
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="#00ffcc" mb={2}>
                Endereço do Agente:
              </Text>
              <Input
                placeholder="0x..."
                value={agentAddress}
                onChange={(e) => setAgentAddress(e.target.value)}
                bg="blackAlpha.800"
                color="white"
                borderColor="cyan.500"
                _hover={{ borderColor: "cyan.300" }}
              />
            </Box>

            {/* 🔥 Botões de Ação */}
            <HStack spacing={4} justify="center">
              <Button onClick={() => handleTransaction("addAgent")} isDisabled={!selectedContract || !agentAddress} bg="cyan.500">
                ➕ Adicionar Agente
              </Button>

              <Button onClick={() => handleTransaction("removeAgent")} isDisabled={!selectedContract || !agentAddress} bg="red.500">
                ❌ Remover Agente
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* 🔥 AgentsStepper - Lado Direito */}
        <Box w="50%" minH="250px">
          <AgentsStepper selectedContract={selectedContract} agentAddress={agentAddress} activeStep={activeStep} />
        </Box>
      </HStack>
    </Box>
  );
};
