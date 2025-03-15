import { Flex, Text, Spacer, HStack, Icon, Avatar } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FiActivity, FiDatabase, FiUsers, FiCheckCircle, FiSettings } from "react-icons/fi";
import { MdOutlineRealEstateAgent } from "react-icons/md";

import { CustomConnect } from "../CustomConnect";

export const Header = () => {
  return (
    <Flex
      as="header"
      // bg="var(--background-dark)"
      p={4}
      align="center"
      borderBottom="1px solid var(--accent)"
      boxShadow="0px 0px 20px var(--accent)"
      color="var(--text-primary)"
    >
      <Text fontSize="2xl" fontWeight="bold" color="var(--text-link)" textShadow="0px 0px 15px var(--text-link)">
        <Icon as={MdOutlineRealEstateAgent} boxSize={50} color="var(--accent)" />
      </Text>

      <Spacer />

      <HStack spacing={6} > 
        <NavLink to="/dashboard/events">
          <HStack cursor="pointer">
            <Icon as={FiActivity} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">Eventos</Text>
          </HStack>
        </NavLink>
        <NavLink to="/dashboard/tokens">
          <HStack cursor="pointer">
            <Icon as={FiDatabase} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">Tokens</Text>
          </HStack>
        </NavLink>
        <NavLink to="/dashboard/agents">
          <HStack cursor="pointer">
            <Icon as={FiUsers} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">Agentes</Text>
          </HStack>
        </NavLink>
        <NavLink to="/dashboard/compliance">  
          <HStack cursor="pointer">
            <Icon as={FiCheckCircle} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">Compliance</Text>
          </HStack>
        </NavLink>
        {/* <NavLink to="/dashboard/approve-buyer">
          <HStack cursor="pointer">
            <Icon as={FiCheckCircle} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">Aprovar Comprador</Text>
          </HStack>
        </NavLink>
        <NavLink to="/dashboard/kyc">
          <HStack cursor="pointer">
            <Icon as={FiSettings} boxSize={5} color="var(--text-primary)" />
            <Text color="var(--text-primary)">KYC</Text>
          </HStack>
        </NavLink> */}
      </HStack>

      <Spacer />

      <Spacer />

      <Spacer />

      <CustomConnect />
    </Flex>
  );
};
