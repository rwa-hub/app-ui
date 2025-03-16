import { HStack, Button, Text } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <HStack spacing={4} justify="center" mt={4}>
      <Button 
        onClick={handlePrevious} 
        isDisabled={currentPage <= 1}
        bg="var(--background-dark)"
        color="var(--text-primary)"
        _hover={{ bg: "var(--accent)" }}
      >
        ⬅️ Anterior
      </Button>

      <Text fontSize="md" color="var(--text-primary)">
        Página {currentPage} de {totalPages}
      </Text>

      <Button 
        onClick={handleNext} 
        isDisabled={currentPage >= totalPages}
        bg="var(--background-dark)"
        color="var(--text-primary)"
        _hover={{ bg: "var(--accent)" }}
      >
        Próxima ➡️
      </Button>
    </HStack>
  );
};
