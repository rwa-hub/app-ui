import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const NeonButton = ({ children }: { children: React.ReactNode }) => (
  <Button
    as={motion.button}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    px={6}
    py={3}
    bg="var(--solid-button-bg)"
    color="var(--button-solid-text)"
    borderRadius="lg"
    fontWeight="bold"
    textTransform="uppercase"
    boxShadow="0px 0px 15px var(--primary)"
    transition="0.3s"
    _hover={{
      boxShadow: "0px 0px 25px var(--primary)",
      bg: "var(--button-primary__01)",
    }}
  >
    {children}
  </Button>
);
