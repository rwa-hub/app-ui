export const filterAgentFunctions = (abi: any[]) => {
    return abi.filter(
      (item) => item.type === "function" && ["addAgent", "removeAgent"].includes(item.name)
    );
  };
  