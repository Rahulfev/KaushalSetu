import { useEffect, useState } from "react";
import {
  createJob,
  getMyJobs,
  deleteJob,
  updateJob,
  cancelJob
} from "../services/jobService";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load jobs
  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs();
      setJobs(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Create job
  const addJob = async (data) => {
    await createJob(data);
    loadJobs();
  };

  // Delete job
  const removeJob = async (id) => {
    await deleteJob(id);
    loadJobs();
  };

  // Cancel job (once it has an assigned worker, it can no longer be deleted)
  const cancelJobAction = async (id) => {
    await cancelJob(id);
    loadJobs();
  };

  // Update job
  const editJob = async (id, data) => {
    await updateJob(id, data);
    loadJobs();
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return {
    jobs,
    loading,
    addJob,
    removeJob,
    cancelJobAction,
    editJob
  };
};
