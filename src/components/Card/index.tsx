import { Box, Text } from "@chakra-ui/react";

export const Card = ({ title, description }: { title: string; description: string }) => (
  <Box
    p={6}
    borderRadius="lg"
    border="1px solid var(--panel-card-border)"
    bg="var(--background-light)"
    boxShadow="0px 0px 20px var(--primary)"
    transition="0.3s"
    _hover={{
      boxShadow: "0px 0px 30px var(--accent)",
      transform: "scale(1.02)",
    }}
  >
    <Text fontSize="lg" fontWeight="bold" color="var(--primary)" mb={2}>
      {title}
    </Text>
    <Text color="var(--text-secondary)">{description}</Text>
  </Box>
);
