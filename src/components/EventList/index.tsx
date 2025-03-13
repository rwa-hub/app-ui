import { VStack, Text } from "@chakra-ui/react";
import EventItem from "./EventItem";

interface Event {
  id: string;
  type: string;
  data: any;
}

const EventList = ({ events }: { events: Event[] }) => {
  return (
    <VStack align="start" spacing={4}>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </VStack>
  );
};

export default EventList;
