import { Box, VStack, Image, Button, Icon, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Footer } from "../Footer";
import { Home, BookOpen, Info } from "lucide-react";
import logo from "@/assets/logo.png";

// Motion Components para animações suaves
const MotionBox = motion(Box);

export const Sidebar = () => {
  return (
    <MotionBox
      as="aside"
      w="260px"
      bg="var(--background-dark)"
      h="100vh"
      display="flex"
      flexDirection="column"
      boxShadow="0px 0px 10px var(--accent)"
      borderRight="2px solid var(--accent)"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 🔹 Logo e navegação */}
      <VStack p={4} spacing={3} align="start" flex="1">
        <Image src={logo} alt="Logo" w="180px" mb={4} />

        <NavLink to="/dashboard/rwa-info">
          <Button variant="ghost" colorScheme="blue" w="full" leftIcon={<Icon as={Home} />}>
            RWA
          </Button>
        </NavLink>

        <NavLink to="/dashboard/about">
          <Button variant="ghost" colorScheme="blue" w="full" leftIcon={<Icon as={Info} />}>
            Sobre
          </Button>
        </NavLink>

        <NavLink to="/dashboard/docs">
          <Button variant="ghost" colorScheme="blue" w="full" leftIcon={<Icon as={BookOpen} />}>
            Documentação
          </Button>
        </NavLink>
      </VStack>

      {/* 🔥 Footer fixo no final */}
      <Box p={4}>
        <Footer />
      </Box>
    </MotionBox>
  );
};
