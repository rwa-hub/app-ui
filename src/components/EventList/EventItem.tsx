import { Box, Text } from "@chakra-ui/react";

interface Event {
  id: string;
  type: string;
  data: any;
}

const EventItem = ({ event }: { event: Event }) => {
  return (
    <Box
      bg="backgroundLight"
      p={4}
      borderRadius="lg"
      boxShadow="0px 0px 10px var(--ck-colors-highlight)"
      w="100%"
    >
      <Text fontWeight="bold" color="primary">
        Tipo: {event.type}
      </Text>
      <Text color="textSecondary">
        Dados: {JSON.stringify(event.data)}
      </Text>
    </Box>
  );
};

export default EventItem;
