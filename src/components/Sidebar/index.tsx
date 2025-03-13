import { Box, Flex, Text, Avatar, VStack, HStack, Button, Icon, Spacer, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiActivity, FiHome, FiSettings, FiBell } from "react-icons/fi";
import logo from "@/assets/logo.png";

// Motion Components para animações suaves
const MotionBox = motion(Box);
// const MotionFlex = motion(Flex);

export const Sidebar = () => {



  return (
    <MotionBox
      as="aside"
      w="260px"
      bg="var(--background-dark)"
      h="100vh"
      boxShadow="0px 0px 20px var(--accent)"
      borderRight="2px solid var(--accent)"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <VStack p={6} spacing={6} align="start">
        <Image src={logo} alt="Logo" w="250px" h="210px" />
        <Button leftIcon={<FiHome />} variant="ghost" colorScheme="blue">
          Início
        </Button>
        <Button leftIcon={<FiActivity />} variant="ghost" colorScheme="blue">
          Eventos
        </Button>
        <Button leftIcon={<FiSettings />} variant="ghost" colorScheme="blue">
          Configurações
        </Button>
      </VStack>
    </MotionBox>
  );
};
