import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <Flex direction="row" minH="100vh">
      <Sidebar />
      <Flex direction="column" flex="1" bg="var(--background-app)" minH="100vh">
        <Header />
        {/* Conteúdo da Dashboard */}
        <Box flex="1" p={6} overflow="auto">
          <Outlet />
        </Box>
        {/* Footer fixo abaixo do conteúdo */}
        <Box as="footer" w="100%" bg="var(--background-medium)" p={4} textAlign="center" boxShadow="0px -2px 10px var(--rose)">
          <Footer />
        </Box>
      </Flex>
    </Flex>
  );
};
