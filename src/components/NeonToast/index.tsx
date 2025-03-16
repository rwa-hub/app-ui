import { Box, Text, HStack } from "@chakra-ui/react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

const toastStyle = {
  background: "rgba(10, 12, 50, 0.95)",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0px 0px 15px rgba(0, 255, 204, 0.7)",
  border: "1px solid var(--rose)",
  color: "white",
  maxWidth: "450px",
  wordBreak: "break-word" as "break-word",
  whiteSpace: "normal",
};

const NeonToast = {
  success: (message: string) => {
    sonnerToast.success(
      <Box textAlign="center" p={4} bg="linear-gradient(145deg, rgba(10, 12, 50, 0.9), rgba(18, 22, 75, 0.95))">
        <HStack spacing={3} alignItems="center" justifyContent="center">
          <CheckCircle size={28} color="#00ffcc" />
          <Text fontWeight="bold" color="#00ffcc" fontSize="lg">
            Sucesso!
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.300" mt={2} px={2} lineHeight="1.4">
          {message}
        </Text>
      </Box>,
      { style: toastStyle, position: "top-center", duration: 5000 }
    );
  },

  error: (message: string) => {
    sonnerToast.error(
      <Box textAlign="center" p={4} bg="linear-gradient(145deg, rgba(50, 10, 10, 0.9), rgba(75, 18, 22, 0.95))">
        <HStack spacing={3} alignItems="center" justifyContent="center">
          <XCircle size={28} color="#ff2a6d" />
          <Text fontWeight="bold" color="#ff2a6d" fontSize="lg">
            Erro!
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.300" mt={2} px={2} lineHeight="1.4">
          {message}
        </Text>
      </Box>,
      { style: toastStyle, position: "top-center", duration: 6000 }
    );
  },

  warning: (message: string) => {
    sonnerToast.warning(
      <Box textAlign="center" p={4} bg="linear-gradient(145deg, rgba(50, 50, 10, 0.9), rgba(75, 75, 18, 0.95))">
        <HStack spacing={3} alignItems="center" justifyContent="center">
          <AlertTriangle size={28} color="#ffd700" />
          <Text fontWeight="bold" color="#ffd700" fontSize="lg">
            Atenção!
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.300" mt={2} px={2} lineHeight="1.4">
          {message}
        </Text>
      </Box>,
      { style: toastStyle, position: "top-center", duration: 5000 }
    );
  },

  info: (message: string) => {
    sonnerToast.info(
      <Box textAlign="center" p={4} bg="linear-gradient(145deg, rgba(10, 10, 50, 0.9), rgba(18, 22, 75, 0.95))">
        <HStack spacing={3} alignItems="center" justifyContent="center">
          <Info size={28} color="#87CEFA" />
          <Text fontWeight="bold" color="#87CEFA" fontSize="lg">
            Informação!
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.300" mt={2} px={2} lineHeight="1.4">
          {message}
        </Text>
      </Box>,
      { style: toastStyle, position: "top-center", duration: 5000 }
    );
  },
};

export default NeonToast;
