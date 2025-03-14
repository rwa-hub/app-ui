import { useEffect } from "react";
import { useEventStore } from "@/store/useEventStore";

export const useFetchHistory = (collection: string, page = 1, limit = 10) => {
  const fetchHistory = useEventStore((state) => state.fetchHistory);

  useEffect(() => {
    fetchHistory(collection, page, limit);
  }, [collection, page, limit]);
};
