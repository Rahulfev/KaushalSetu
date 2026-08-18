// Placeholder for API calls
export const fetchOrgProfile = async () => {
    const userName = localStorage.getItem('userName');
    return { name: userName || "Organization Name" }; 
};