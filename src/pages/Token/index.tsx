import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Select,
  Text,
} from "@chakra-ui/react";
import { useWriteContract, usePublicClient } from "wagmi";

import { TransactionModal } from "./TransactionModal";
import TOKEN_RWA_ABI from "@/utils/abis/token.json";

import { extractWriteFunctionsFromABI, functionInputs, generateInputsFromABI } from "@/utils/function-inputs";
import { NeonLoader } from "@/components/NeonLoader";
import NeonToast from "@/components/NeonToast";
import { useEventStore } from "@/store/useEventStore";



const contracts = {
  tokenRWA: {
    name: "Token RWA",
    address: import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`,
    abi:  TOKEN_RWA_ABI,
    functions: extractWriteFunctionsFromABI(TOKEN_RWA_ABI),
  }
};

export const Token = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const connectWebSocket = useEventStore((state) => state.connectWebSocket);

  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [isModalOpen, setModalOpen] = useState(false);

  const selectedContract = contracts.tokenRWA;
  const [isTransactionPending, setTransactionPending] = useState(false);

  const handleTransaction = async () => {
    try {
      if (!selectedFunction) {
        NeonToast.warning("Selecione uma função antes de continuar.");
        return;
      }

      const functionDef = selectedContract.abi.find((fn: any) => fn.name === selectedFunction);
      if (!functionDef) throw new Error("Função não encontrada no ABI.");

      const args = functionDef.inputs.map((input: any) => {
        const value = formData[input.name];

        if (input.type === "uint16") return Number(value);
        if (input.type === "address") return value.toLowerCase();
        return value;
      });

      if (args.length !== functionDef.inputs.length) {
        throw new Error(`Número de argumentos inválido. Esperado: ${functionDef.inputs.length}, recebido: ${args.length}`);
      }


      // 🔥 FECHA O MODAL IMEDIATAMENTE APÓS O CLIQUE
      setModalOpen(false);

      const result = await writeContractAsync({
        address: selectedContract.address,
        abi: selectedContract.abi,
        functionName: selectedFunction,
        args,
      });

      if (!result) throw new Error("Erro ao enviar transação.");
      setTransactionPending(true);

      // 🔥 AGUARDA A CONFIRMAÇÃO, MAS O MODAL JÁ FOI FECHADO
      const receipt = await publicClient?.waitForTransactionReceipt({ hash: result });

      if (receipt?.status === "success") {
        setTransactionPending(false);
        NeonToast.success("Transação concluída com sucesso!");
      } else {
        throw new Error("A transação falhou.");
      }
    } catch (error: any) {
      console.error("❌ Erro na transação:", error);
      setTransactionPending(false);

      if (error?.code === 4001) {
        NeonToast.warning("Transação rejeitada pelo usuário.");
      } else {
        NeonToast.error(error.message || "Houve um erro na transação.");
      }
    }
  };


  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <Box>
      {isTransactionPending && <NeonLoader />}
      
      <Box
        bg="var(--background-medium-opacity-1)"
        p={5}
        borderRadius="lg"
        boxShadow="10px 0 0 2px var(--accent)"
        textAlign="center"
        color="white"
        w="100%"
        mb={6}
      >
        <Text fontFamily="ExoBold" textAlign="left" fontSize="3xl" color="var(--rose)">
          Token RWA (ERC-3643)
        </Text>
        <Text textAlign="left" fontSize="md" fontStyle={"initial"} mt={2} color="gray.300">
          O <span style={{ color: "var(--rose)" }}>Token RWA</span> implementa o padrão <span style={{ color: "var(--rose)" }}>ERC-3643</span> para 
          tokenização de ativos do mundo real. Este token permite a transferência segura de ativos tokenizados entre 
          usuários verificados, garantindo conformidade regulatória e rastreabilidade de todas as transações.
        </Text>
      </Box>

      {/* Formulário de Seleção */}
      <VStack spacing={4} mt={6}>
        <Select
          placeholder="Selecione uma função"
          value={selectedFunction}
          onChange={(e) => {
            setSelectedFunction(e.target.value);
            setModalOpen(true);
          }}
        >
          {contracts.tokenRWA.functions.map((func: string) => (
            <option key={func} value={func}>
              {functionInputs[func as keyof typeof functionInputs]?.label || func}
            </option>
          ))}
        </Select>
      </VStack>

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
    </Box>
  );
};
