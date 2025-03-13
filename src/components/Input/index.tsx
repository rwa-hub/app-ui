import { Input, InputProps } from "@chakra-ui/react";

export const NeonInput = (props: InputProps) => (
  <Input
    {...props}
    bg="var(--background-medium)"
    color="var(--text-primary)"
    border="1px solid var(--accent)"
    borderRadius="md"
    p={3}
    transition="0.3s"
    _focus={{
      borderColor: "var(--primary)",
      boxShadow: "0px 0px 15px var(--primary)",
    }}
    _placeholder={{
      color: "var(--text-tertiary)",
    }}
  />
);
