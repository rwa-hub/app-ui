import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

export const NeonLoader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="100"
      bg="rgba(10, 10, 10, 0.95)"
      borderRadius="lg"
      p={8}
      boxShadow="0px 0px 25px var(--rose)"
      border="2px solid var(--rose)"
      overflow="hidden"
      w="30%"
      h="30%"
    >
      {/* 🔥 Efeito Neon Pulsante */}
      <MotionBox
        position="absolute"
        width="100px"
        height="100px"
        borderRadius="50%"
        border="8px solid var(--accent)" // Borda mais grossa
        boxShadow="0px 0px 35px var(--accent)" // Sombra mais intensa
        opacity={0.8} // Opacidade base maior
        filter="blur(12px)" // Blur um pouco menor para mais nitidez
        mb={10}
        animate={{
          scale: [1, 1.6, 1], // Escala maior
          opacity: [0.6, 1, 0.6], // Maior variação de opacidade
        }}
        transition={{ repeat: Infinity, duration: 0.2}} 
      />

      {/* 🔥 Círculo Neon Rotativo */}
      <MotionBox
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.5, }}
        width="80px"
        height="80px"
        border="6px solid transparent"
        borderTop="6px solid var(--rose) "
        borderRadius="50%"
        boxShadow="0px 0px 20px var(--rose)"
        position="relative"
      />

      {/* 🔥 Texto Animado */}
      <MotionText
        mt={5}
        color="var(--rose)"
        fontSize="lg"
        fontWeight="bold"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: [0.42, 0, 0.58, 1] }}

      >
        Processando...
      </MotionText>
    </Box>
  );
};
