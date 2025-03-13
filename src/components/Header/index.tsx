import { Flex, Text, Spacer, Box, HStack, Icon } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { motion } from "framer-motion";
import { FiBell } from "react-icons/fi";

const MotionFlex = motion(Flex);

export const Header = () => {
  return (
    <MotionFlex
      as="header"
      bg="var(--background-dark)"
      p={4}
      align="center"
      borderBottom="2px solid var(--accent)"
      boxShadow="0px 0px 20px var(--accent)"
      color="var(--text-primary)"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="blue.200"
        textShadow="0px 0px 15px var(--primary)"
      >
        Painel de Controle
      </Text>
      <Spacer />
      <HStack spacing={4}>
        <Icon as={FiBell} boxSize={6} color="var(--primary)" cursor="pointer" />
        <Avatar name="Usuário" boxShadow="0px 0px 10px var(--accent)" border="2px solid var(--primary)" />
      </HStack>
    </MotionFlex>
  );
};