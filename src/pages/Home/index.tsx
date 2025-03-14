import { Box, Flex, Text, Button, VStack, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

// Motion Components para animações suaves
const MotionBox = motion(Box);

export const Home = () => {
  return (
    <MotionBox
      as="section"
      w="100%"
      h="100vh"
      bg="var(--background-app)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Logo e título */}
      <VStack spacing={6}>
        <Image src={logo} alt="Logo" w="200px" />
        <Text fontSize="4xl" fontWeight="bold" color="var(--primary)" textShadow="0px 0px 20px var(--primary)">
          Welcome to Real World Assets Tokenization
        </Text>
        <Text fontSize="lg" color="var(--text-secondary)">
          Monitor real world assets in real time, manage tokens and users.
        </Text>

        {/* Botão de acesso à Dashboard */}
        <NavLink to="/dashboard">
          <Button
            size="lg"
            bg="var(--button-primary)"
            color="var(--background-dark)"
            boxShadow="0px 0px 15px var(--button-primary)"
            _hover={{ transform: "scale(1.05)" }}
            transition="0.3s"
          >
            Access Dashboard
          </Button>
        </NavLink>
      </VStack>
    </MotionBox>
  );
};
