import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <Flex direction="row" minH="100vh">
      <Sidebar />
      <Flex direction="column" flex="1" height="100vh" overflow="hidden">
        <Header />
        <Box flex="1" overflowY="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};
