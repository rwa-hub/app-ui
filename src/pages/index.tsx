import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { EventRecentsContent } from "./EventRecents";


export const Dashboard = () => {
  return (
    <Flex>
      <Sidebar />
      <Box flex={1} bg="var(--background-dark)" minH="100vh">
        <Header />
        <EventRecentsContent />
      </Box>
    </Flex>
  );
};
