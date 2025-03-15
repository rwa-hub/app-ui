export const functionInputs = {
    addAgent: {
      label: "Adicionar um Agente",
      inputs: [{ name: "_agent", type: "address", label: "Endereço do Agente" }],
    },
    removeAgent: {
      label: "Remover um Agente",
      inputs: [{ name: "_agent", type: "address", label: "Endereço do Agente" }],
    },
    approveBuyer: {
      label: "Aprovar um Comprador",
      inputs: [
        { name: "buyer", type: "address", label: "Endereço do Comprador" },
        { name: "creditInsuranceApproved", type: "bool", label: "Seguro de Crédito Aprovado" },
        { name: "serasaClearance", type: "bool", label: "Verificação no Serasa" },
        { name: "documentsVerified", type: "bool", label: "Documentos Verificados" },
        { name: "income", type: "uint256", label: "Renda Mensal (em wei)" },
        { name: "addressVerified", type: "string", label: "Endereço Verificado" },
        { name: "saleRegistered", type: "bool", label: "Venda Registrada" },
        { name: "signedAgreement", type: "bool", label: "Contrato Assinado" },
      ],
    },
    bindToken: {
      label: "Vincular um Token",
      inputs: [{ name: "_token", type: "address", label: "Endereço do Token" }],
    },
    addModule: {
      label: "Adicionar um Módulo",
      inputs: [{ name: "_module", type: "address", label: "Endereço do Módulo" }],
    },
    removeModule: {
      label: "Remover um Módulo",
      inputs: [{ name: "_module", type: "address", label: "Endereço do Módulo" }],
    },
    bindCompliance: {
      label: "Vincular Compliance",
      inputs: [{ name: "_compliance", type: "address", label: "Endereço do Compliance" }],
    },
    registerIdentity: {
      label: "Registrar Identidade",
      inputs: [
        { name: "_userAddress", type: "address", label: "Endereço do Usuário" },
        { name: "_identity", type: "address", label: "Endereço da Identidade" },
        { name: "_country", type: "uint16", label: "Código do País" },
      ],
    },
    updateIdentity: {
      label: "Atualizar Identidade",
      inputs: [
        { name: "_userAddress", type: "address", label: "Endereço do Usuário" },
        { name: "_identity", type: "address", label: "Novo Endereço da Identidade" },
      ],
    },
  };
  
  export const generateInputsFromABI = (contractABI: any[], functionName: string) => {
    const functionData = contractABI.find((item) => item.type === "function" && item.name === functionName);
    
    if (!functionData) return [];
  
    return functionData.inputs.map((input: any, index: number) => ({
      name: input.name || `param${index}`,
      type: input.type,
      label: input.name ? input.name.replace(/_/g, " ").toUpperCase() : `Parâmetro ${index + 1}`,
    }));
  };
  

  export const extractWriteFunctionsFromABI = (abi: any) => {
    return abi
      .filter((item: any) => item.type === "function" && item.stateMutability !== "view" && item.stateMutability !== "pure")
      .map((item: any) => item.name);
  };
  