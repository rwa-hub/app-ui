export type BaseEvent = {
    _id: string;
    eventType: string;
    timestamp: string;
    contractAddress: string;
    transactionHash: string;
    blockNumber: string;
  };
  
  // 🔹 Tipos específicos de eventos
  export type AgentAddedEvent = BaseEvent & { Agent: string };
  export type TransferEvent = BaseEvent & { From: string; To: string; Value: number };
  export type BuyerApprovedEvent = BaseEvent & { Buyer: string; CreditInsuranceApproved: boolean };
  export type AddressFrozenEvent = BaseEvent & { UserAddress: string; IsFrozen: boolean; Owner: string };
  export type UnpausedEvent = BaseEvent & { UserAddress: string };
  
  // 🔹 Tipo genérico que pode ser qualquer um dos eventos
  export type EventData = AgentAddedEvent | TransferEvent | BuyerApprovedEvent | AddressFrozenEvent | UnpausedEvent;
  