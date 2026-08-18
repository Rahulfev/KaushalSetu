import { useEffect, useState } from "react";
import { getClientApplications, updateApplicationStatus } from "../services/applicationService";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await getClientApplications();
      setApplications(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    await updateApplicationStatus(applicationId, status);
    loadApplications();
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return {
    applications,
    loading,
    updateStatus
  };
};