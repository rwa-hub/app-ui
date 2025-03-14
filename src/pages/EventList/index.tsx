import { VStack, Box, Text, Flex } from "@chakra-ui/react";
import { EventItem } from "./EventItem";
import { EventItemProps } from "./types";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const mockEvents: EventItemProps["event"][] = [
  {
    id: 1,
    title: "Transação Confirmada",
    description: "Uma transação foi confirmada na blockchain.",
    date: "2025-03-13 14:30",
    status: "success",
  },
  {
    id: 2,
    title: "Erro de Validação",
    description: "A validação de um token falhou.",
    date: "2025-03-13 15:00",
    status: "error",
  },
  {
    id: 3,
    title: "Novo Usuário Registrado",
    description: "Um novo usuário foi registrado com sucesso.",
    date: "2025-03-13 15:30",
    status: "neutral",
  },
  {
    id: 4,
    title: "Novo Contrato Criado",
    description: "Um novo contrato foi implantado na rede.",
    date: "2025-03-13 16:00",
    status: "focus",
  },
  {
    id: 5,
    title: "Erro de Rede",
    description: "Houve um erro na conexão com o nó blockchain.",
    date: "2025-03-13 16:30",
    status: "warning",
  },
  {
    id: 6,
    title: "Saldo Atualizado",
    description: "O saldo do usuário foi atualizado.",
    date: "2025-03-13 17:00",
    status: "success",
  },
];

export const EventList = () => {
  return (
    <Flex w="100%" h="calc(100vh - 250px)" align="center" justify="center">
      <MotionBox
        p={6}
        w="95%" // 🔹 Garante um espaçamento lateral
        h="100%" // 🔹 Ajusta dinamicamente
        bg="var(--background-dark)"
        borderRadius="lg"
        boxShadow="0px 0px 20px var(--semanticNeutral)"
        border="2px solid var(--semanticNeutral)"
        textAlign="start"
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4} color="var(--accent)">
          Recent Events
        </Text>

        {/* 🔹 Área que contém os eventos com scroll interno */}
        <Box
          flex="1"
          overflowY="auto"
          p={2}
          borderRadius="md"
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "var(--semanticFocusShadow)",
              borderRadius: "10px",
            },
          }}
        >
          <VStack spacing={4} align="stretch">
            {mockEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </VStack>
        </Box>
      </MotionBox>
    </Flex>
  );
};
