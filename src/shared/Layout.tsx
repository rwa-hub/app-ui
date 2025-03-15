import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <Flex direction="row" minH="100vh">
      <Sidebar />
      <Flex direction="column" flex="1"  minH="100vh">
        <Header />

        {/* 🔹 Área de Conteúdo Fixa, garantindo espaço para o Footer */}
        <Box flex="1" p={6} display="flex" flexDirection="column" overflow="hidden">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};
