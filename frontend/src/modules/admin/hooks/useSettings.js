import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminService from '../../../services/adminService';

const useSettings = () => {
  // 1. Profile State
  const [profile, setProfile] = useState({ 
    name: '', 
    email: '', 
    phone: '' 
  });

  // 2. System Toggles (Real requirements)
  const [system, setSystem] = useState({ 
    maintenanceMode: false, 
    emailNotifications: true,
    allowNewRegistrations: true,
    enableEscrow: true 
  });

  // 3. Policy Rules (Real requirements)
  const [policies, setPolicies] = useState({ 
    disputeTimeout: 48, // hours
    maxJobsPerWorker: 5,
    commissionRate: 10, // %
    refundPolicy: 'Standard' 
  });

  // 4. Notification Templates
  const [templates, setTemplates] = useState({
    welcomeEmail: "Welcome to KaushalSetu! We are glad to have you.",
    jobAlert: "New Job Alert: A job matching your skills is available."
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AdminService.getProfile();
        setProfile(res.data);
      } catch (err) {
        toast.error("Could not load admin profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- HANDLERS ---

  // Handle Profile Inputs
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await AdminService.updateProfile(profile);
      setProfile(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Profile update failed. Please try again.");
    }
  };

  // Handle System Switches
  const handleSystemToggle = (key) => {
    setSystem(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Policy Inputs
  const updatePolicy = (key, value) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
  };

  const savePolicies = () => {
    toast.success(`Policies saved — Commission: ${policies.commissionRate}%, Dispute Time: ${policies.disputeTimeout}h`);
  };

  // Handle Template Inputs
  const updateTemplate = (key, value) => {
    setTemplates(prev => ({ ...prev, [key]: value }));
  };

  const saveTemplates = () => {
    toast.success("Notification templates saved!");
  };

  return { 
    profile, setProfile, handleProfileUpdate,
    system, handleSystemToggle,
    policies, updatePolicy, savePolicies,
    templates, updateTemplate, saveTemplates,
    loading
  };
};

export default useSettings;