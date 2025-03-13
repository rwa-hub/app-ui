import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const EventRecentsContent = () => {
    return (
      <Box p={6} color="var(--text-primary)">
        <Text fontSize="xl" fontWeight="bold" mb={4} color="var(--secondary)">
          Eventos Recentes
        </Text>
        <VStack spacing={4}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MotionBox
              key={i}
              p={4}
              w="full"
              bg="var(--background-medium)"
              borderRadius="lg"
              boxShadow="0px 0px 15px var(--primary)"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Text>📡 Evento {i + 1}: Transação concluída na Blockchain</Text>
            </MotionBox>
          ))}
        </VStack>
      </Box>
    );
  };
  