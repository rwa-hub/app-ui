import { Box, Heading, Text, VStack, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

export const RWAInfo = () => {
  return (
    <Box
      flex="1"
      display="flex"
      flexDirection="column"
      height="100%"
      overflow="hidden"
    >
      {/* 🔹 Conteúdo rolável */}
      <Box
        flex="1"
        overflowY="auto"
        pr={2}
        pl={2}
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Heading as="h1" size="xl" textAlign="start" color="var(--accent)" mb={4}>
          RWA e o Protocolo ERC-3643
        </Heading>

        <Text fontSize="lg" color="gray.300" textAlign="justify">
          O protocolo <strong>ERC-3643</strong> permite a <strong>tokenização segura</strong> de ativos do mundo real
          (<strong>RWA - Real World Assets</strong>), garantindo compliance e facilitando a negociação de imóveis, títulos financeiros e commodities.
        </Text>

        <VStack spacing={6} align="start" mt={6}>
          <Box>
            <Heading as="h2" size="lg" color="var(--rose)" mb={2}>
              O que são Ativos do Mundo Real (RWA)?
            </Heading>
            <Text fontSize="md" color="gray.300" textAlign="justify">
              RWA são ativos físicos ou financeiros representados digitalmente em uma blockchain, como imóveis, ações tokenizadas e créditos de carbono.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" color="var(--rose)" mb={2}>
              Como o ERC-3643 Funciona?
            </Heading>
            <Text fontSize="md" color="gray.300" textAlign="justify">
              O ERC-3643 adiciona um <strong>mecanismo de compliance</strong> que verifica a identidade dos participantes antes das transações, garantindo segurança.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" color="var(--rose)" mb={2}>
              Benefícios do ERC-3643 para Empresas e Investidores
            </Heading>
            <List spacing={3} color="gray.300">
              <ListItem><ListIcon as={FaCheckCircle} color="green.400" />Maior liquidez para ativos tradicionalmente ilíquidos.</ListItem>
              <ListItem><ListIcon as={FaCheckCircle} color="green.400" />Compliance automatizado com regulamentações financeiras.</ListItem>
              <ListItem><ListIcon as={FaCheckCircle} color="green.400" />Acesso global a investimentos tokenizados.</ListItem>
              <ListItem><ListIcon as={FaCheckCircle} color="green.400" />Redução de custos operacionais e intermediários.</ListItem>
            </List>
          </Box>

          <Box>
            <Heading as="h2" size="lg" color="var(--rose)" mb={2}>
              Casos de Uso Reais
            </Heading>
            <Text fontSize="md" color="gray.300">
              Empresas já estão utilizando o ERC-3643 para transformar o mercado:
            </Text>
            <List spacing={3} color="gray.300" mt={2}>
              <ListItem><ListIcon as={FaCheckCircle} color="blue.400" />Tokenização de imóveis.</ListItem>
              <ListItem><ListIcon as={FaCheckCircle} color="blue.400" />Emissão de títulos financeiros digitais.</ListItem>
              <ListItem><ListIcon as={FaCheckCircle} color="blue.400" />Certificados de carbono tokenizados.</ListItem>
            </List>
          </Box>

          <Box>
            <Heading as="h2" size="lg" color="var(--rose)" mb={2}>
              Conclusão e Próximos Passos
            </Heading>
            <Text fontSize="md" color="gray.300" textAlign="justify">
              O protocolo ERC-3643 traz segurança, compliance e acessibilidade para investimentos tokenizados. Explore as oportunidades da tokenização para sua empresa.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};
