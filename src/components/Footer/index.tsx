import { Box, Text, HStack, Icon, Link } from "@chakra-ui/react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const Footer = () => {
  return (
    <MotionBox
      as="footer"
      w="100%"
      bg="var(--background-dark)"
      py={4}
      borderTop="2px solid var(--accent)"
      textAlign="center"
      mt="auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Text fontSize="sm" color="var(--text-primary)">
        © {new Date().getFullYear()} RWAHUB | Todos os direitos reservados
      </Text>

      <HStack spacing={4} justify="center" mt={2}>
        <Link href="https://twitter.com" isExternal>
          <Icon as={FaTwitter} boxSize={35} color="var(--rose)" _hover={{ color: "var(--semanticSuccess)" }} />
        </Link>
        <Link href="https://github.com" isExternal>
          <Icon as={FaGithub} boxSize={35} color="var(--rose)" _hover={{ color: "var(--semanticSuccess)" }} />
        </Link>
        <Link href="https://linkedin.com" isExternal>
          <Icon as={FaLinkedin} boxSize={35} color="var(--rose)" _hover={{ color: "var(--semanticSuccess)" }} />
        </Link>
      </HStack>
    </MotionBox>
  );
};
