import { Flex, Text, Spacer } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import React from "react";


export const Header = () => {
  return (
    <Flex bg="backgroundDark" p={4} align="center" color="white" boxShadow="0px 0px 10px var(--ck-colors-neonBlue)">
      <Text fontSize="lg" fontWeight="bold" color="primary">
        Painel de Controle
      </Text>
      <Spacer />
      <Avatar size="sm" name="Usuário" boxShadow="0px 0px 10px var(--ck-colors-accent)" />
    </Flex>
  );
};