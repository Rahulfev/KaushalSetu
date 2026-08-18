import { useState, useEffect } from 'react';
import { fetchOrgProfile } from '../services/orgService';

export const useOrgData = () => {
    const [orgName, setOrgName] = useState("User");

    useEffect(() => {
        fetchOrgProfile().then(data => setOrgName(data.name));
    }, []);

    return { orgName };
};