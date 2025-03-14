import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";

export const CustomConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <Box
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    onClick={openConnectModal}
                    bg="linear-gradient(90deg, #f56bff,rgb(0, 204, 200))"
                    color="var(--primary-light)"
                    textShadow="2px 2px 10px black"
                    _hover={{
                      bg: "linear-gradient(90deg,rgb(79, 17, 133), #f56bff)",
                      transform: "scale(1.05)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    borderRadius="lg"
                    boxShadow="0px 0px 15px rgba(245, 107, 255, 0.7)"
                    px={6}
                    py={2}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    🚀 Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    bg="linear-gradient(90deg, #ff416c, #ff4b2b)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(90deg, #ff4b2b, #ff416c)",
                      transform: "scale(1.05)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    borderRadius="lg"
                    boxShadow="0px 0px 15px rgba(255, 65, 108, 0.7)"
                    px={6}
                    py={2}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    ⚠️ Wrong Network
                  </Button>
                );
              }

              return (
                <HStack spacing={4}>
                  {/* Botão de Rede */}
                  <Button
                    onClick={openChainModal}
                    bg="linear-gradient(90deg, #f56bff, #22D1F8)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(90deg, #22D1F8, #f56bff)",
                      transform: "scale(1.05)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    borderRadius="lg"
                    boxShadow="0px 0px 12px rgba(245, 107, 255, 0.8)"
                    px={5}
                    py={2}
                    fontSize="md"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <Box
                        bg={chain.iconBackground}
                        w={5}
                        h={5}
                        borderRadius="full"
                        overflow="hidden"
                        mr={2}
                      >
                        <Image alt={chain.name ?? "Chain icon"} src={chain.iconUrl} />
                      </Box>
                    )}
                    🌐 {chain.name}
                  </Button>

                  {/* Botão da Conta */}
                  <Button
                    onClick={openAccountModal}
                    bg="linear-gradient(90deg, #8e44ad, #f56bff)"
                    color="white"
                    _hover={{
                      bg: "linear-gradient(90deg, #f56bff, #8e44ad)",
                      transform: "scale(1.05)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    borderRadius="lg"
                    boxShadow="0px 0px 15px rgba(142, 68, 173, 0.7)"
                    px={6}
                    py={2}
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    🦊 {account.displayName}
                    {account.displayBalance && (
                      <Text as="span" ml={2} color="gray.300">
                        ({account.displayBalance})
                      </Text>
                    )}
                  </Button>
                </HStack>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
