// src/components/Layout.tsx
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex h="100vh" bg="backgroundDark">
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column">
        <Header />
        <Box flex="1" p={6} bg="backgroundDark">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;
