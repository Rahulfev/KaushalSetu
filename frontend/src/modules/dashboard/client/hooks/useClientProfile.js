import { useEffect, useState } from "react";
import {
  getClientProfile,
  updateClientProfile,
  deleteClientAccount
} from "../services/clientProfileService";

export const useClientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await getClientProfile();
      setProfile(res.data);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data) => {
    await updateClientProfile(data);
    await loadProfile();
  };

  const deleteAccount = async () => {
    await deleteClientAccount();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { profile, loading, saveProfile, deleteAccount };
};
