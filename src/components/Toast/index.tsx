import { useToast, Box, Text, HStack, Icon } from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const toastColors = {
  success: { color: "#39D0D8", shadow: "0px 0px 12px #39D0D899", icon: FiCheckCircle },
  error: { color: "#FF4EA3", shadow: "0px 0px 12px #FF4EA399", icon: FiXCircle },
  warning: { color: "#B89900", shadow: "0px 0px 12px #B8990099", icon: FiAlertTriangle },
  neutral: { color: "#ABC4FF", shadow: "0px 0px 12px #ABC4FF99", icon: FiInfo },
  focus: { color: "#A259FF", shadow: "0px 0px 12px #A259FF99", icon: FiInfo },
};

export const useNeonToast = () => {
  const toast = useToast();

  return (status: keyof typeof toastColors, title: string, description?: string) => {
    const { color, shadow, icon } = toastColors[status];

    toast({
      position: "top-right",
      duration: 5000,
      isClosable: true,
      render: () => (
        <Box
          bg="var(--background-dark)"
          color={color}
          p={4}
          borderRadius="md"
          boxShadow={shadow}
          border={`1px solid ${color}`}
        >
          <HStack>
            <Icon as={icon} boxSize={6} color={color} />
            <Box>
              <Text fontWeight="bold" color={color}>
                {title}
              </Text>
              {description && <Text fontSize="sm" color="var(--text-primary)">{description}</Text>}
            </Box>
          </HStack>
        </Box>
      ),
    });
  };
};
