import { useEffect, useState } from "react";
import {
  getClientContracts,
  updateContractStatus,
} from "../services/clientContractService";

const useClientContracts = (clientId) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await getClientContracts(clientId);
      setContracts(res.data);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (contractId, status) => {
    await updateContractStatus(contractId, status);
    fetchContracts();
  };

  useEffect(() => {
    if (clientId) {
      fetchContracts();
    }
  }, [clientId]);

  return { contracts, loading, changeStatus };
};

export default useClientContracts;
