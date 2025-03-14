import { Box, VStack, Image, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
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
      boxShadow="0px 0px 10px var(--accent)"
      borderRight="2px solid var(--accent)"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <VStack p={4} spacing={1} align="start"> 
        <Image src={logo} alt="Logo" w="180px" mb={2} />

        <NavLink to="/dashboard/rwa">
          <Button variant="ghost" colorScheme="blue" w="full">
            RWA
          </Button>
        </NavLink>

        <NavLink to="/dashboard/about">
          <Button variant="ghost" colorScheme="blue" w="full">
            About
          </Button>
        </NavLink>

        <NavLink to="/dashboard/docs">
          <Button variant="ghost" colorScheme="blue" w="full">
            Docs
          </Button>
        </NavLink>
      </VStack>
    </MotionBox>
  );
};
