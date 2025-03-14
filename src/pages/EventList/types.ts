export interface EventItemProps {
    event: {
      id: number;
      title: string;
      description: string;
      date: string;
      status: "success" | "error" | "warning" | "neutral" | "focus";
    };
  }
  