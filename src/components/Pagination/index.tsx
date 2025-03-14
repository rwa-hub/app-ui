import { Button, HStack } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <HStack justify="center" spacing={2} mt={4}>
      <Button size="sm" onClick={() => onPageChange(currentPage - 1)} isDisabled={currentPage <= 1}>
        ◀ Anterior
      </Button>
      <Button size="sm" fontWeight="bold" isDisabled>
        Página {currentPage} de {totalPages}
      </Button>
      <Button size="sm" onClick={() => onPageChange(currentPage + 1)} isDisabled={currentPage >= totalPages}>
        Próximo ▶
      </Button>
    </HStack>
  );
};
